import React, { Component } from "react";
import {Text, View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView} from "react-native";
import { submitDeck } from "../utils/api";
import { connect } from "react-redux";
import { addDeck } from "../actions";
import { purple, white, gray, green } from "../utils/colors";

const SubmitButton = ({ onPress, disabled }) => {
    return (
        <TouchableOpacity
            style={[styles.submitButton, disabled && styles.disabled]}
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={styles.submitBtnText}>Create Deck</Text>
        </TouchableOpacity>
    );
};

class AddDeck extends Component {
    constructor(props) {
        super(props);
        this.state = { title: "" };
    }

    submit = () => {
        const deck = this.state;

        this.setState(() => ({
            title: "",
            color: gray,
        }));

        submitDeck(deck);

        this.props.dispatch(addDeck(deck));

        this.props.navigation.navigate("DeckDetails", {
            title: deck.title,
        });
    };

    render() {
        return (
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}>
                <Text style={styles.pageDescription}>
                    What is the title of your new deck?
                </Text>
                <TextInput
                    multiline={false}
                    numberOfLines={3}
                    style={styles.input}
                    onChangeText={(title) => this.setState({ title })}
                    value={this.state.title}
                    placeholder={"Deck Title"}
                    placeholderTextColor={purple}
                />
                <SubmitButton
                    onPress={this.submit}
                    disabled={this.state.title === ""}
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
    },
    pageDescription: {
        fontSize: 20,
        margin: 10,
    },
    input: {
        height: 80,
        margin: 10,
        fontSize: 22,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: purple,
        borderRadius: 6,
        width: "80%",
        padding: 10,
    },
    submitButton: {
        backgroundColor: green,
        padding: 10,
        borderRadius: 5,
        height: 45,
        margin: 10,
        alignSelf: "flex-start",
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
    },
});

const mapStateToProps = (state, { navigation }) => {
    return {
        goBack: () => navigation.goBack(),
    };
};

export default connect(mapStateToProps)(AddDeck);