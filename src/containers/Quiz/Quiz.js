import React, { Component } from "react";
import classes from "./Quiz.module.css";
import ActiveQuiz from "../../components/ActiveQuiz/ActiveQuiz";
import FinishedQuiz from "../../components/FinishedQuiz/FinishedQuiz";

class Quiz extends Component {
  state = {
    results: {}, //тут храним информацию о всех ответах ( результат правильно/неправильно) {[id]: 'success' 'error'}
    isFinished: false,
    activeQuestion: 0,
    answerState: null, //тут храним информацию о текущем клике пользователя (правильно/неправильно) {[id]: 'success' 'error'}
    quiz: [
      {
        id: 1,
        question: "Сколько штатов в Мексике?",
        rightAnswerId: 4,
        answers: [
          { text: "39", id: 1 },
          { text: "20", id: 2 },
          { text: "50", id: 3 },
          { text: "19", id: 4 },
        ],
      },
      {
        id: 2,
        question: "Что такое арбуз?",
        rightAnswerId: 2,
        answers: [
          { text: "Овощ", id: 1 },
          { text: "Ягода", id: 2 },
          { text: "Животное", id: 3 },
          { text: "Фрукт", id: 4 },
        ],
      },
    ],
  };

  onAnswerClickHandler = (answerId) => {
    //проверка для предотвращения повторного клика
    if (this.state.answerState) {
      const key = Object.keys(this.state.answerState)[0];
      if (this.state.answerState[key] === "success") {
        return;
      }
    }

    const results = this.state.results;
    const question = this.state.quiz[this.state.activeQuestion];

    if (question.rightAnswerId === answerId) {
      //правильный ответ

      if (!results[question.id]) {
        results[question.id] = "success";
      }

      this.setState({
        answerState: { [answerId]: "success" },
        results,
      });

      const timeout = window.setTimeout(() => {
        if (this.isQuizFinished()) {
          this.setState({
            isFinished: true,
          });
        } else {
          this.setState({
            activeQuestion: this.state.activeQuestion + 1,
            answerState: null,
          });
        }

        window.clearTimeout(timeout);
      }, 700);
    } else {
      //неправильный
      results[question.id] = "error";
      this.setState({
        answerState: { [answerId]: "error" },
        results,
      });
    }
  };

  isQuizFinished() {
    return this.state.activeQuestion + 1 === this.state.quiz.length;
  }

  retryHandler = () => {
    this.setState({
      activeQuestion: 0,
      answerState: null,
      isFinished: false,
      results: {},
    });
  };

  render() {
    return (
      <div className={classes.Quiz}>
        <div className={classes.QuizWrapper}>
          <h1>The strangest quiz ever</h1>

          {this.state.isFinished ? (
            <FinishedQuiz
              results={this.state.results}
              quiz={this.state.quiz}
              onRetry={this.retryHandler}
            />
          ) : (
            <ActiveQuiz
              answers={this.state.quiz[this.state.activeQuestion].answers}
              question={this.state.quiz[this.state.activeQuestion].question}
              onAnswerClick={this.onAnswerClickHandler}
              quizLength={this.state.quiz.length}
              answerNumber={this.state.activeQuestion + 1}
              state={this.state.answerState}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Quiz;
