import React, { Component } from 'react'
import {Text, View, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView} from 'react-native'
import { connect } from 'react-redux'
import { addCard } from '../actions'
import { submitCard } from '../utils/api'
import { purple, white, green } from '../utils/colors'

const SubmitButton = ({ onPress, disabled }) => {
    return (
        <TouchableOpacity style={[styles.submitButton, disabled && styles.disabled]}
            onPress={onPress} disabled={disabled}>
            <Text style={styles.submitBtnText}>SUBMIT</Text>
        </TouchableOpacity>
    )
}

class AddCard extends Component {
    static navigationOptions = () => {
        return {
            title: "New Card",
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            question: "",
            answer: "",
            deckTitle: this.props.deckTitle,
        }
    }

    submit = () => {
        const { question, answer, deckTitle } = this.state
        const card = { question, answer }

        this.setState(() => ({
            question: "",
            answer: "",
        }))

        submitCard(card, deckTitle)

        this.props.dispatch(addCard(card, deckTitle))

        this.props.goBack()
    };

    render() {
        const { deckColor } = this.props

        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={[styles.container, { backgroundColor: deckColor }]}>
                <TextInput
                    multiline={true}
                    numberOfLines={3}
                    style={styles.input}
                    onChangeText={(question) => this.setState({ question })}
                    value={this.state.question}
                    placeholder={"Question"}
                    placeholderTextColor={purple}
                />
                <TextInput
                    multiline={true}
                    numberOfLines={3}
                    style={styles.input}
                    onChangeText={(answer) => this.setState({ answer })}
                    value={this.state.answer}
                    placeholder={"Answer"}
                    placeholderTextColor={purple}
                />
                <SubmitButton
                    onPress={this.submit}
                    disabled={this.state.question === "" || this.state.answer === ""}
                />
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexWrap: "wrap",
        justifyContent: "center",
        padding: 10,
        height: "100%",
        alignItems: "center",
        flex: 1,
    },
    input: {
        height: 80,
        margin: 10,
        fontSize: 22,
        padding: 10,
        backgroundColor: white,
        width: "80%",
        borderWidth: 1,
    },
    submitButton: {
        backgroundColor: green,
        padding: 10,
        borderRadius: 5,
        height: 45,
        margin: 10,
        alignSelf: "flex-end",
        justifyContent: "center",
        alignItems: "center",
    },
    disabled: {
        opacity: 0.5,
    },
    submitBtnText: {
        color: white,
        fontSize: 22,
        textAlign: "center",
    }
})

const mapStateToProps = (state, props) => {
    const { deckTitle, deckColor } = props.route.params;

    return {
        deckTitle,
        deckColor,
        goBack: () => props.navigation.goBack(),
    }
}

export default connect(mapStateToProps)(AddCard)