import create from "./http-service"

type Genre = {
    "_id": string,
    "name": string,
}

export interface Movie {
    "_id": string,
    "title": string,
    "numberInStock": number,
    "dailyRentalRate": number,
    "genre": Genre,
    "poster": string,
}

export interface PostMovie {
    "title": string,
    "numberInStock": number,
    "dailyRentalRate": number,
    "genre": string,
    "poster": string,
}

export default create('/movies')

