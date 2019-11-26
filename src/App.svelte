<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

<script>
  import QuizArea from './QuizArea.svelte';

  let playerScore = 0;
</script>

<main>
  <p style="color: white">Score: {playerScore} / 10</p>
  <QuizArea
    on:score={e => {
      playerScore = e.detail.score;
    }} />
</main>
