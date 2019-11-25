<style>
  #main {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    height: calc(100vh - 40%);
    width: calc(100vw - 40%);
    padding: 15px;

    background-color: white;
    border-radius: 6px;
    box-shadow: 0 0 5px white;

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

  #difficulty {
    position: absolute;
    right: 16px;
    top: 16px;
    height: 25px;
    width: 80px;
    padding: 5px;

    background: rgb(97, 225, 230);
    color: white;
    text-align: center;
    border-radius: 16px;
  }

  #category {
    font-size: 12px;
    font-weight: normal;
  }

  #button-bar {
    position: absolute;
    bottom: 16px;
    right: 0;
  }

  #choice {
    margin-top: 16px;
    padding: 8px;

    border: 1px solid #4e5656;
    border-radius: 8px;
  }

  #choice:hover {
    cursor: pointer;
    background: green;
    border: 1px solid green;
    color: white;
  }

  #snackbar {
    position: absolute;
    left: 16px;
    bottom: 16px;
  }

  @media screen and (max-width: 960px) {
    #main {
      width: calc(100vw - 15%);
    }
    #difficulty {
      top: -16px;
    }
  }
</style>

<script>
  import { onMount } from 'svelte';
  import { htmlDecode, shuffle } from './utils.js';
  import Snackbar from './Snackbar.svelte';

  let data = [];

  let questionNo = 0;
  let question = 'loading...';
  let answerChoices = [];
  let answer = '';
  let category = 'loading...';
  let difficulty = 'loading...';

  let representation = [];
  let snackbarVisibility = false;

  function fetchData() {
    fetch('https://opentdb.com/api.php?amount=10')
      .then(resp => resp.json())
      .then(res => {
        data = res.results;

        representation = data.reduce((acc, curr) => {
          acc.push({
            question: htmlDecode(curr.question),
            answerChoices: shuffle(
              [...curr.incorrect_answers, curr.correct_answer].map(ans =>
                htmlDecode(ans)
              )
            ),
            answer: htmlDecode(curr.correct_answer),
            category: htmlDecode(curr.category),
            difficulty: curr.difficulty,
            answerChoice: '',
            correct: false
          });
          return acc;
        }, []);

        console.log(representation);
      })
      .catch(e => console.error(e));
  }

  onMount(fetchData);

  function handleClick(change) {
    snackbarVisibility = false;

    if (change === 'f') questionNo += 1;
    else questionNo -= 1;
  }

  function handleAnswerChoice(e) {
    if (e.target.innerText === answer && !correct) {
      correct = true;
    } else if (correct) correct = false;
    snackbarVisibility = true;
  }
</script>

<div id="main">

  {#if representation.length > 0}
    <span id="heading">
      Question {questionNo + 1}
      <i id="category">(Category - {representation[questionNo].category})</i>
    </span>
    <span>{representation[questionNo].question}</span>
    <div id="difficulty">{representation[questionNo].difficulty}</div>

    {#if representation[questionNo].answerChoices}
      {#each representation[questionNo].answerChoices as choice}
        <div id="choice" on:click={e => handleAnswerChoice(e)}>
          <i>{choice}</i>
        </div>
      {/each}
    {/if}

    <div id="button-bar">
      {#if questionNo < 9}
        <button value="Next" on:click={() => handleClick('f')}>Next</button>
      {/if}
      {#if questionNo > 0}
        <button value="Back" on:click={() => handleClick('b')}>Previous</button>
      {/if}
    </div>

    <!-- {#if snackbarVisibility}
    <div id="snackbar">
      <Snackbar message={correct} />
    </div>
  {/if} -->
  {/if}

</div>
