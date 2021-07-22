import { RECEIVE_DECKS, ADD_DECK, ADD_CARD } from '../actions'

function decks(state = {}, action) {
    switch (action.type) {
        case RECEIVE_DECKS:
            return {
                ...state,
                ...action.decks,
            }
        case ADD_DECK:
            return {
                ...state,
                [action.deck.title]: action.deck,
            }
        case ADD_CARD:
            const { card, deckTitle } = action
            let decks = {}

            decks = {
                ...state,
                [deckTitle]: {
                    ...state[deckTitle],
                    questions: state[deckTitle].questions.concat(card),
                },
            }
            return {
                ...state,
                ...decks,
            }
        default:
            return state
    }
}

export default decks