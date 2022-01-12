const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');
const DRINKS_URLS = { coffee: 'https://api.sampleapis.com/coffee/hot', beer: 'https://api.sampleapis.com/beers/ale' }

const beerDescriptionMapping = [
    { name: 'Porter', description: `A type of ale, porter beers are known for their dark black color and roasted malt aroma and notes. Porters may be fruity or dry in flavor, which is determined by the variety of roasted malt used in the brewing process.` },
    { name: 'Stout', description: `Like porters, stouts are dark, roasted ales. Stouts taste less sweet than porters and often feature a bitter coffee taste, which comes from unmalted roasted barley that is added to the wort. They are characterized by a thick, creamy head. Ireland's Guinness may be one of the world's best-known stouts.` },
    { name: 'Brown Ale', description: `Brown ales range in color from amber to brown, with chocolate, caramel, citrus, or nut notes. Brown ales are a bit of a mixed bag, since the different malts used and the country of origin can greatly affect the flavor and scent of this underrated beer style.` },
    { name: 'Pale Ale', description: `An English style of ale, pale ales and known for their copper color and fruity scent. Don't let the name fool you: these beers are strong enough to pair well with spicy foods. Related to the pale is the APA, or American Pale Ale, which is somewhat of a hybrid between the traditional English pale ale and the IPA style. American pale ales are hoppier and usually feature American two row malt.` },
    { name: 'IPA', description: `Originally, India Pale Ale or IPA was a British pale ale brewed with extra hops. High levels of this bittering agent made the beer stable enough to survive the long boat trip to India without spoiling. The extra dose of hops gives IPA beers their bitter taste. Depending on the style of hops used, IPAs may have fruit-forward citrus flavors or taste of resin and pine. American brewers have taken the IPA style and run with it, introducing unusual flavors and ingredients to satisfy U.S. beer drinkers' love for the brew style.` },
    { name: 'Ale', description: `Ale is a general category of beer: You'll find sub-categories like brown ales or pale ales. This is the oldest style of beer, which dates back to antiquity. What distinguishes an ale - and also makes this category of beer accessible for home brewers - is a warm-temperature fermentation for a relatively short period of time. In the brewing process, brewers introduce top-fermenting yeasts which, as the name suggests, ferment on the top of the brew. The fermentation process turns what would otherwise be a barley and malt tea into a boozy beverage.` },
];

const fetchDrinks = async (type) => {
    let result = [];
    switch (type) {
        case undefined:
        case '':
            console.log(type, 'blend')
            const coffeeList = await getCoffee();
            const beerList = await getBeer();
            result = coffeeList.concat(beerList);
            break;
        case 'coffee':
            console.log(type, 'coffee')

            result = await getCoffee();
            break;
        case 'beer':
            console.log(type, 'beer')

            result = await getBeer();
            break;
        default:
            console.log('error')
            return { Message: 'Invalid type.' }
            break;
    }
    return result.sort((a, b) => +b.rating - +a.rating);
}


const getBeer = async () => {
    const beerRes = await axios.get(DRINKS_URLS.beer);

    const beerList = beerRes.data.filter(beer => beer.name !== '').map(beer => {
        return {
            name: beer.name,
            price: beer.price,
            rating: beer.rating.average.toFixed(3),
            description: beerDescriptionMapping.find(desc => {
                return beer.name.includes(desc.name)
            }) || '',
            image: beer.image,
            id: uuidv4()
        }
    }).map(beer => {
        return {
            ...beer, description: beer.description.description ? beer.description.description : ''
        }
    });

    return beerList;
}

const getCoffee = async () => {
    const coffeeRes = await axios.get(DRINKS_URLS.coffee);

    const coffeeList = coffeeRes.data.filter(coffee => coffee.title !== '').map((coffee) => {
        return {
            name: coffee.title,
            price: `$${(Math.random() * (20 - 8) + 8).toFixed(0)}.99`,
            rating: (Math.random() * (5 - 1) + 1).toFixed(3),
            description: coffee.description,
            id: uuidv4()
        }
    });

    const coffeeListWImage = await Promise.all(coffeeList.map(async (coffee) => {
        const image = await axios.get(`https://coffee.alexflipnote.dev/random.json`);
        return {
            ...coffee, image: image.data.file
        }
    }))

    return coffeeListWImage;
}


module.exports = { fetchDrinks }
