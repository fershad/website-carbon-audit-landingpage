<script>
  import { fade } from "svelte/transition";

  const facts = [
    {
      content: `Making a 1kB reduction to a file loaded on over 2 million websites resulted in an estimated
            <strong class="marker-highlight" data-highlight="accent-dark">2950kg less CO<sub>2</sub>
            </strong>
            being produced.`,
      source: `<a href="https://dannyvankooten.com/website-carbon-emissions/" rel="noopener" target="_blank">Danny van Kooten</a>`,
    },
    {
      content: `Global <abbr title="Information and communications technology">ICT</abbr> is responsible for <strong class="marker-highlight" data-highlight="accent-dark">4% of total</strong> greenhouse gas emissions. That's greater than civil aviation.`,
      source: `<a href="https://theshiftproject.org/wp-content/uploads/2019/03/Lean-ICT-Report_The-Shift-Project_2019.pdf" rel="noopener" target="_blank">The Shift Project</a>`,
    },
    {
      content: `The average single webpage produces <strong class="marker-highlight" data-highlight="accent-dark">1.76g of <abbr title="Carbon dioxide equivalent">CO2e</abbr></strong> per view. With 120,000 views a year that's 211kg.`,
      source: `<a href="https://www.websitecarbon.com" rel="noopener" target="_blank">Website Carbon Calculator</a>`,
    },
    {
      content: `DeZeen reduced the size of their homepage by huge 10MB, and in doing so reduce their carbon footprint by an estimated <strong class="marker-highlight" data-highlight="accent-dark">743,820kg of CO<sub>2</sub></strong> a year.`,
      source: `<a href="https://climateaction.tech/blog/letsgreentheweb-campaign-impact/#impact" rel="noopener" target="_blank">ClimateAction.tech</a>`,
    },
  ];

  let fact = 0;
  // $: currentFact = facts[factIndex];

  function nextFact() {
    if (fact === facts.length - 1) {
      fact = 0;
    } else {
      fact = fact + 1;
    }
  }
</script>

<div class="text-center">
  {#key fact}
    <p in:fade>
      {@html facts[fact].content}
    </p>
    <p>
      Source:
      {@html facts[fact].source}
    </p>
  {/key}
  <button class="button pill" data-color="accent-dark" on:click={nextFact}>Show
    next</button>
</div>

<style>
</style>
