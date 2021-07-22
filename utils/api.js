import AsyncStorage from '@react-native-async-storage/async-storage'

import setDummyData from './_data'

const DECKS_STORAGE_KEY = 'MobileFlashCards:decks'

export const getDecks = () => {
    return AsyncStorage.getItem(DECKS_STORAGE_KEY)
        .then((results) => {
            return results === null ? setDummyData : JSON.parse(results)
        })
}

export const submitDeck = (deck) => {
    deck.questions = [];
    return AsyncStorage.mergeItem(
        DECKS_STORAGE_KEY,
        JSON.stringify({
            [deck.title]: deck,
        })
    )
}

export const getDeck = (id) => {
    return AsyncStorage.getItem(DECKS_STORAGE_KEY).then((results) => {
        const data = JSON.parse(results)
        return data[id]
    })
}

export const submitCard = (card, id) => {
    getDeck(id).then((deck) => {
        deck.questions = deck.questions.concat(card)
        return AsyncStorage.mergeItem(
            DECKS_STORAGE_KEY,
            JSON.stringify({
                [id]: deck,
            })
        )
    })
}