import React, { Component } from 'react'
import { Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { receiveDecks } from '../actions'
import { getDecks } from '../utils/api'
import { blue, gray } from '../utils/colors'

class Decks extends Component {
    state = {
        ready: false,
    }
    componentDidMount() {
        const { dispatch } = this.props

        getDecks()
            .then((decks) => {
                dispatch(receiveDecks(decks))
            })
            .then(() => this.setState(() => ({ ready: true })))
    }

    render() {
        const { decks } = this.props

        return (
            <ScrollView>
                {Object.keys(decks).map((title) => {
                    return (
                        <TouchableOpacity
                            style={styles.item}
                            key={title}
                            onPress={() =>
                                this.props.navigation.navigate("DeckDetails", {
                                    title: title,
                                })
                            }
                        >
                            <Text style={styles.heading}>
                                {decks[title].title ? decks[title].title : "No Title"}
                            </Text>
                            <Text style={styles.subheading}>
                                {Object.keys(decks[title].questions).length} cards
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    item: {
        margin: 15,
        borderColor: gray,
        padding: 5,
        borderWidth: 2,
        borderRadius: 5,
    },
    heading: {
        marginTop: 15,
        fontWeight: "600",
        marginBottom: 15,
        fontSize: 25,
        textAlign: "center",
        color: blue,
    },
    subheading: {
        marginBottom: 15,
        textAlign: "center",
    }
})

const mapStateToProps = (decks, { navigation }) => {
    return {
        decks,
        totalDecks: Object.keys(decks).length,
        navigation,
    }
}

export default connect(mapStateToProps)(Decks)