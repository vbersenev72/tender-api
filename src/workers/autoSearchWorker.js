import connectDB from "../../db/mongoCLient";
import db from "../models";

const tendersData = db.tendersData
const autoSearch = db.autoSearch

export const AutoSearch = async () => {
    try {

        const autoSearchList = await autoSearch.findAll()

        for (let i = 0; i < autoSearchList.length; i++) {
            const autoSearchParams = autoSearchList[i];



        }

    } catch (error) {
        console.log(error);
    }
}