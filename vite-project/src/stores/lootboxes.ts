
async function getSkins () {
    let data: any;
    try {
        const response = await fetch(`https://valorant-api.com/v1/weapons`);
        data = await response.json();
    } catch (error) {
        console.warn(error);
    }
    console.log(data)
}

export { getSkins };
