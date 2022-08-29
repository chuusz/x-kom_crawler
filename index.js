const needle = require("needle");
const { headers } = require("needle/lib/auth");
const mongodb = require("./mongodb/mongodb.connect");

const options = {
    headers: {
        "User-Agent":
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Mobile Safari/537.36",
        "x-api-key":
        "jfsTOgOL23CN2G8Y"
    }
};

async function main() {
    const mongoClient = await mongodb();
    const xcomDb = mongoClient.db("x-kom");
    const xiaomiProducts = xcomDb.collection("xiaomi.29.08.22");

    let totalPages = 10;
    for(let currentPage = 1; currentPage < totalPages + 1; currentPage = currentPage + 1) {
        const result = await needle(
            "get",
            `https://mobileapi.x-kom.pl/api/v1/xkom/products?criteria.useAutoFuzziness=false&childCategorySort=priority%20desc&criteria.groupIds=4&criteria.categoryIds=1590&criteria.producerIds=1023&criteria.expand=Features%2CDepartments%2CProductMarks%2CSeo&pagination.currentPage=${currentPage}&pagination.pageSize=30&sort=Popularity%20desc`,
            options
        );
        totalPages = result.body.TotalPages;
        await xiaomiProducts.insertMany(result.body.Items);
        await sleep(5000);
        console.log(currentPage);
        console.log(totalPages);
    }
}

async function sleep(miliseconds) {
    return new Promise(resolve => setTimeout(resolve, miliseconds));
}

main();