<script>
  import { onMount } from 'svelte';

  let questionNo = 0;
  let question;
  let answerChoices;
  let answer;
  let category;
  let difficulty;

  let data;

  function fetchData() {
    fetch('https://opentdb.com/api.php?amount=10')
      .then(resp => resp.json())
      .then(res => {
        data = res.results;
        question = data[questionNo].question;
        answerChoices = [
          ...data[questionNo].incorrect_answers,
          data[questionNo].correct_answer
        ];
        answer = data[questionNo].correct_answer;
        category = data[questionNo].category;
        difficulty = data[questionNo].difficulty;
      })
      .catch(e => console.error(e));
  }

  onMount(fetchData);

  function handleClick(change) {
    if (change === 'f') questionNo += 1;
    else questionNo -= 1;

    question = data[questionNo].question;
    answerChoices = [
      ...data[questionNo].incorrect_answers,
      data[questionNo].correct_answer
    ];
    answer = data[questionNo].correct_answer;
    category = data[questionNo].category;
    difficulty = data[questionNo].difficulty;
  }
</script>

<style>
  div {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    height: calc(100vh - 40%);
    width: calc(100vw - 40%);
    padding: 15px;

    background-color: white;
    border-radius: 6px;
    box-shadow: 1px 1px 10px floralwhite;

    text-align: left;
  }

  span {
    display: block;
    margin-top: 20px;
  }

  button {
    margin-top: 15px;
    margin-right: 15px;
    padding: 10px;
    float: right;

    color: white;
    background-color: #ff3e00;
    border: none;
    border-radius: 10px;
    cursor: pointer;
  }

  button:hover {
    box-shadow: 0 0 5px #ff3e00;
  }

  #heading {
    font-size: 24px;
    font-weight: bolder;
  }
</style>

<div>
  <span id="heading">Question {questionNo + 1}</span>
  <span>{question}</span>
  <span>{answerChoices}</span>
  <span>{answer}</span>
  <span>{category}</span>
  <span>{difficulty}</span>
  <button value="Next" on:click="{() => handleClick('f')}">Next</button>
  {#if questionNo > 0}
  <button
    style="float: left; margin-right: 0; margin-left: 15px;"
    value="Back"
    on:click="{() => handleClick('b')}"
  >
    Previous
  </button>
  {/if}
</div>
