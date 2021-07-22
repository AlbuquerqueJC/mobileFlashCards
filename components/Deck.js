import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { MaterialIcons } from '@expo/vector-icons'
import { black, green, purple } from '../utils/colors'

class Deck extends Component {
    static navigationOptions = ({ navigation }) => {
        const { title } = this.props
        return { title: title }
    }
    render() {
        const { deck } = this.props
        return (
            <View style={[styles.container]}>
                <View style={styles.details}>
                    <Text style={styles.title}>{deck.title}</Text>
                    <Text style={styles.totalNumber}>
                        {deck.questions.length} card(s)
                    </Text>
                </View>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.buttonContainer}
                        onPress={() =>
                            this.props.navigation.navigate("AddCard", {
                                deckTitle: deck.title,
                            })
                        }>
                        <View>
                            <MaterialIcons name="add" style={{ color: green }} size={35} />
                        </View>
                        <Text style={styles.add}>
                            Add Card
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonContainer}
                        onPress={() => {
                            this.props.navigation.navigate("Quiz", {
                                deck: deck,
                            })
                        }}>
                        <View>
                            <MaterialIcons name="play-arrow" style={{ color: black }} size={35} />
                        </View>
                        <Text style={styles.start}>
                            Start a Quiz
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        justifyContent: "space-around",
        flex: 1
    },
    details: {
        alignSelf: "center"
    },
    title: {
        fontSize: 42,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center"
    },
    totalNumber: {
        fontSize: 18,
        textAlign: "center",
        color: purple
    },
    row: {
        justifyContent: "space-around",
    },
    add: {
        color: green,
        fontSize: 25,
        alignItems: "center"
    },
    start: {
        color: black,
        fontSize: 25,
        alignItems: "center"
    },
    iconContainer: {
        padding: 6,
        borderRadius: 8,
        width: 50,
        height: 50
    },
    buttonContainer: {
        borderRadius: 4,
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10
    }
})

const mapStateToProps = (state, props) => {
    const { title } = props.route.params
    return {
        title,
        deck: state[title]
    }
}

export default connect(mapStateToProps)(Deck)