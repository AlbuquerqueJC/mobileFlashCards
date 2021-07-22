import React, { Component } from 'react'
import { Text, View, TouchableOpacity, StyleSheet, Animated } from 'react-native'
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import { connect } from 'react-redux'
import { clearLocalNotification, setLocalNotification } from '../utils/helpers'
import {white, green, red, blue, black} from '../utils/colors'

class Quiz extends Component {
    static navigationOptions = ({ navigation }) => {
        const { title } = navigation.state.params.deck
        return {
            title: title + " Quiz",
        }
    }
    constructor(props) {
        super(props);
        this.state = {
            result: 0,
            QuestionNumber: 0,
            flipped: false,
        }
        this.animatedValue = new Animated.Value(0)
        this.value = 0
        this.animatedValue.addListener(({ value }) => {
            this.value = value;
        })

        this.frontInterpolate = this.animatedValue.interpolate({
            inputRange: [0, 180],
            outputRange: ["0deg", "180deg"],
        })

        this.backInterpolate = this.animatedValue.interpolate({
            inputRange: [0, 180],
            outputRange: ["180deg", "360deg"],
        })
    }
    flipCard() {
        if (this.value >= 90) {
            Animated.spring(this.animatedValue, {
                toValue: 0,
                friction: 8,
                tension: 10,
                useNativeDriver: true,
            }).start()

            this.setState(() => ({
                flipped: false,
            }))
        } else {
            Animated.spring(this.animatedValue, {
                toValue: 180,
                friction: 8,
                tension: 10,
                useNativeDriver: true,
            }).start()

            this.setState(() => ({
                flipped: true,
            }))
        }
    }

    answerQuestion = (type) => {
        const correct = type === "correct"

        let result = correct ? this.state.result + 1 : this.state.result
        let QuestionNumber = this.state.QuestionNumber + 1

        this.setState(() => ({
            result: result,
            QuestionNumber: QuestionNumber,
        }))
        this.state.flipped && this.flipCard()

        clearLocalNotification()
            .then(setLocalNotification)
    };

    resetQuiz = () => {
        this.value >= 90 && this.flipCard();

        this.setState(() => ({
            result: 0,
            QuestionNumber: 0,
            flipped: false,
        }));

        clearLocalNotification()
            .then(setLocalNotification)
    };

    render() {
        const deck = this.props.deck;
        const { questions, color } = deck;

        const { QuestionNumber, result } = this.state;
        const questionsTotal = questions.length;

        // If there are no questions:
        if (questionsTotal === 0) {
            return (
                <View style={[styles.container, styles.center, { backgroundColor: color }]}>
                    <Text style={{ fontSize: 20, textAlign: "center" }}>
                        Sorry, there are no cards left in the deck.
                        Restart or create more cards!
                    </Text>
                </View>
            );
        } else if (QuestionNumber + 1 > questionsTotal) {
            // Or If the quiz is completed
            return (
                <View style={[styles.container, styles.center, { backgroundColor: white }]}>

                    <Text style={{ color: green, fontSize: 30, textAlign: "center" }}>
                        You finished the quiz 👏!
                    </Text>

                    <Text style={{ fontSize: 25, textAlign: "center" }}>
                        Your score: {result}/{QuestionNumber} - {result/QuestionNumber * 100}%
                    </Text>

                    <View style={[styles.row, styles.center, { backgroundColor: color }]}>
                        <TouchableOpacity style={styles.flip} onPress={() => this.props.goBack()}>
                            <View style={[styles.iconWrapper, { backgroundColor: red}]}>
                                <Ionicons name="md-caret-back-circle" style={{ color: white }} size={35} />
                            </View>
                            <Text style={{ fontSize: 20, color: red, textAlign: "center" }}>
                                Back
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.flip} onPress={() => this.resetQuiz()}>
                            <View style={[styles.iconWrapper, { backgroundColor: green}]}>
                                <MaterialCommunityIcons name="restart" style={{ color: white }} size={35} />
                            </View>
                            <Text style={{ fontSize: 20, color: green, textAlign: "center" }}>
                                Restart
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }

        const frontAnimatedStyle = {
            transform: [{ rotateY: this.frontInterpolate }],
        };

        const backAnimatedStyle = {
            transform: [{ rotateY: this.backInterpolate }],
        };

        // Quiz view
        return (
            <View style={[styles.container, { backgroundColor: color }]}>
                <View style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                    <View>
                        <Animated.View style={[styles.card, frontAnimatedStyle]}>
                            <View>
                                <Text style={styles.main}>
                                    {questions[QuestionNumber].question}
                                </Text>
                            </View>
                        </Animated.View>
                        <Animated.View style={[styles.card, styles.back, backAnimatedStyle]}>
                            <View>
                                <Text style={styles.main}>{questions[QuestionNumber].answer}</Text>
                            </View>
                            <View />
                        </Animated.View>
                    </View>
                </View>

                <View style={styles.row}>
                    <TouchableOpacity style={styles.correct}
                                      onPress={() => this.answerQuestion("correct")}>
                        <View style={[styles.iconWrapper, { backgroundColor: green }]}>
                            <MaterialIcons name="check" style={{ color: white }} size={35} />
                        </View>
                        <Text>Correct</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.flip}
                                      onPress={() => this.flipCard()}>
                        <View style={[styles.iconWrapper, { backgroundColor: blue}]}>
                            <MaterialIcons name="flip" style={{ color: white }} size={35} />
                        </View>
                        <Text>
                            {this.state.flipped ? "Question" : "Answer"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.incorrect}
                                      onPress={() => this.answerQuestion("incorrect")}>
                        <View style={[styles.iconWrapper, { backgroundColor: red }]}>
                            <MaterialIcons name="close" style={{ color: white }} size={35} />
                        </View>
                        <Text>Incorrect</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.quizProgress}>
                    <Text>
                        Progress: {this.state.QuestionNumber + 1}/{questionsTotal}
                    </Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        backgroundColor: white,
        height: "100%",
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 200,
    },
    quizProgress: {
        fontSize: 35,
        fontWeight: "bold",
        marginTop: 10,
        marginLeft: 10,
        alignSelf: "flex-start",
    },
    heading: {
        fontWeight: "800",
        marginBottom: 20,
        fontSize: 22,
        textAlign: "center",
    },
    card: {
        alignSelf: "center",
        alignItems: "center",
        height: 500,
        width: 300,
        justifyContent: "center",
        backgroundColor: white,
        borderRadius: 5,
        backfaceVisibility: "hidden",
    },
    back: {
        position: "absolute",
    },
    main: {
        fontSize: 40,
        textAlign: "center",
    },
    row: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    correct: {
        margin: 10,
        color: green,
        fontSize: 25,
        alignItems: "center"
    },
    flip: {
        margin: 10,
        color: black,
        fontSize: 12,
        alignItems: "center"
    },
    incorrect: {
        margin: 10,
        color: red,
        fontSize: 25,
        alignItems: "center"
    },
    iconWrapper: {
        padding: 6,
        borderRadius: 8,
        width: 50,
        height: 50
    },
    center: {
        alignContent: "center",
        justifyContent: "center"
    }
})

const mapStateToProps = (state, props) => {
    const { deck } = props.route.params

    return {
        deck,
        goBack: () => props.navigation.goBack()
    }
}

export default connect(mapStateToProps)(Quiz)