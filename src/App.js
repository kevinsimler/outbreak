import React, { Component } from 'react'
import './App.css'
import Grid from "./components/Grid";
import NodeLegend from "./components/NodeLegend";
import Figure from "./components/Figure";

type Props = {
}

type State = {
  spoilersVisible: boolean,
}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      spoilersVisible: false,
    }
  }

  // noinspection JSMethodCanBeStatic
  renderMainPost() {
    let spoilerOrNot;
    let showSpoilerButton;
    if (!this.state.spoilersVisible) {
      spoilerOrNot = "spoiler";
      // showSpoilerButton = <WidgetButton highlighted={false} onClick={() => { this.setState({criticalThresholdVisible: true}); } } >Show spoilers</WidgetButton>
    } else {
      spoilerOrNot = "spoiler-revealed";
      // showSpoilerButton = <WidgetButton highlighted={false} onClick={() => { this.setState({criticalThresholdVisible: false}); } } >Hide spoilers</WidgetButton>
    }
    showSpoilerButton = <label><span style={{cursor: "pointer"}}><input type="checkbox" value={this.state.spoilersVisible} onChange={(e) => { this.setState({spoilersVisible: e.target.checked}); }}/> Show spoilers</span></label>;


    let exposed_you = <code className="code-exposed">you</code>;

    let susceptible = <code className="code-susceptible">Susceptible</code>;
    let infected = <code className="code-infectious">Infected</code>;
    let recovered = <code className="code-removed">Recovered</code>;
    let dead = <code className="code-dead">Dead</code>;

    // noinspection HtmlRequiredAltAttribute
    return (
      <div className="post-content">
        <div>
          <h1>Outbreak</h1>
          <h5 className="author">by Kevin Simler<br/>March 16, 2020</h5>
        </div>
        <div>
          <span className="deemphasized"><a href="https://www.podemosaprender.org/brote/">en Español</a></span>
        </div>
        <div>
          <a href="https://twitter.com/Harry_Stevens">Harry Stevens</a> at The Washington Post recently published a <em>very</em> elegant simulation of how a disease like COVID-19 spreads. If you haven't already, I highly recommend <a href="https://www.washingtonpost.com/graphics/2020/world/corona-simulator/">checking it out</a>.
        </div>
        <div>
          Today I want to follow up with something I've been working on: <strong>playable simulations</strong> of a disease outbreak. "Playable" means you'll get to tweak parameters (like transmission and mortality rates) and watch how the epidemic unfolds.
        </div>
        <div>
          By the end of this article, I hope you'll have a better understanding — perhaps better <em>intuition</em> — for what it takes to contain this thing. But first!...
        </div>
        {/*<div>*/}
        {/*  Last year, I wrote a <a href="https://meltingasphalt.com/interactive/going-critical/">viral article about viral growth</a>.*/}
        {/*</div>*/}
        {/*<div>*/}
        {/*  It featured <strong>playable simulations</strong> of things that spread across a population. Things like viruses (yes), but also ideas, fashions, and other trends.*/}
        {/*</div>*/}
        {/*<div>*/}
        {/*  Today, in light of our current crisis, I wanted a chance to revisit these simulations. And you can play with them in just a moment. But first...*/}
        {/*</div>*/}
        <div>
          <span style={{backgroundColor: '#FFC'}}><strong>AN IMPORTANT WARNING</strong></span>:
        </div>
        <div>
          <strong>This is <em>not</em> an attempt to model COVID-19.</strong>
        </div>
        <div>
          What follows is a <em>simplified</em> model of a disease process. The goal is to learn how epidemics unfold <em>in general</em>.
        </div>
        <div>
          <span>WARNING #2</span>: I'm not an epidemiologist! I defer to infectious disease experts (and so should you). I have almost certainly made mistakes in this article, but I'll correct them as quickly as I can. If you see any problems, please <a href="https://meltingasphalt.com/contact/">get in touch</a>.
        </div>
        <div>
          Alright?
        </div>
        <div>
          Let's do this.
        </div>
        <div>
          <h3>A grid of people</h3>
        </div>
        <div>
          We're going to build our model up slowly, one piece at a time.
        </div>
        <div>
          The first thing a disease needs is a <strong>population</strong>, i.e., the set of people who can potentially catch the disease. Ours will live in neat rows and columns, like the 9x9 grid you see here:
        </div>
        <Figure>
          <Grid daysIncubating={0}
                daysSymptomatic={1}
                gridRows={9}
                gridCols={9}
                nodeSize={30}
                nug={1}
                randomSeed={100}
                personHours={4}
                showPlaybackControls={false}
                speed={0.4}
                transmissionProbability={1}
                travelRadius={1}
          />
        </Figure>
        <div>
          Each square represents a single person. The poor soul at the center, as you may have guessed, is {infected}. Meanwhile, everyone else is {susceptible}.
        </div>
        <div>
          <h3>Time</h3>
        </div>
        <div>
          Now let's incorporate time into our model.
        </div>
        <div>
          The "Step" button (below) moves the simulation forward 1 day per click. Or you can press the ▷ button to watch things happen on their own:
        </div>
        <Figure>
          <Grid daysIncubating={0}
                daysSymptomatic={10000000000}
                gridRows={9}
                gridCols={9}
                nodeSize={30}
                nug={1}
                randomSeed={100}
                personHours={4}
                showInteractions={false}
                speed={0.4}
                transmissionProbability={1}
                travelRadius={1}
          />
        </Figure>
        <div>
          Oh no. It looks like everyone sneezed on their immediate neighbors — north, east, south, west — and the whole world got sick.
        </div>
        <div>
          <h3>Recovery</h3>
        </div>
        <div>
          But people don't stay sick forever. Let's see what happens when they get better after 2 steps (i.e., 2 days):
        </div>
        <Figure>
          <Grid daysIncubating={0}
                daysSymptomatic={2}
                gridRows={9}
                gridCols={9}
                nodeSize={30}
                nug={1}
                randomSeed={100}
                personHours={4}
                showInteractions={false}
                speed={0.4}
                transmissionProbability={1}
                travelRadius={1}
          />
        </Figure>
        <div>
          Great, now people can transition from {infected} to {recovered}.
        </div>
        <div>
          Here's a handy legend:
        </div>
        <div>
          <ul>
            <li><NodeLegend type="susceptible"/> &nbsp;<b>Susceptible</b></li>
            <li><NodeLegend type="infected"/> &nbsp;<b>Infected</b></li>
            <li><NodeLegend type="removed"/> &nbsp;<b>Recovered</b></li>
          </ul>
        </div>
        <div>
          For purposes of our simulation, once someone is {recovered}, they can't get reinfected. This is hopefully (and probably) true for COVID-19, but not certain.
        </div>
        <div>
          <h3>Incubation period</h3>
        </div>
        <div>
          In discussions of COVID-19, you may have heard that the disease has a long <strong>incubation period</strong>. This is the time between when a person initially contracts the disease and the onset of first symptoms.
        </div>
        <div>
          With COVID-19, it seems that patients are contagious during the incubation period. They may not even realize they're sick, but they're still able to infect others.
        </div>
        <div>
          We will replicate this feature in our disease model. (But remember, we're not trying to model COVID-19 precisely!)
        </div>
        <div>
          Here's what an incubation period looks like:
        </div>
        <Figure>
          <Grid gridRows={25}
                gridCols={25}
                nodeSize={20}
                nug={1}
                randomSeed={100}
                personHours={4}
                showDaysPerStateControls={true}
                showInteractions={false}
                speed={0.4}
                transmissionProbability={1}
                travelRadius={1}
          />
        </Figure>
        <div>
          The way I've chosen to model this disease, there's no important distinction between the pink and red states. As far as the virus is concerned, both states behave the same.
        </div>
        <div>
          Nevertheless, I wanted to include the incubation period as a (visual) reminder that carriers of COVID-19 are lurking among us, hidden from the official statistics, totally unaware that they're infected.
        </div>
        <div>
          ... unaware that they're spreading the disease to others.
        </div>
        <div>
          Even as you read this, {exposed_you} may be such a person.
        </div>
        <div>
          <ul>
            <li><NodeLegend type="susceptible"/> &nbsp;<b>Susceptible</b></li>
            <li><NodeLegend type="exposed"/> &nbsp;<b>Infected (incubation period, no symptoms)</b></li>
            <li><NodeLegend type="infected"/> &nbsp;<b>Infected (with symptoms)</b></li>
            <li><NodeLegend type="removed"/> &nbsp;<b>Recovered</b></li>
          </ul>
        </div>
        <div>
          <h3>Probabilistic infection</h3>
        </div>
        <div>
          OK, enough.
        </div>
        <div>
          Real diseases don't spread outward with 100 percent certainty. They spread probabilistically.
        </div>
        <div>
          So let's introduce a new parameter: the <strong>transmission rate</strong>. This controls the chance that an infection gets passed from person to person.
        </div>
        <div>
          Can you find a value for the transmission rate that keeps the disease from spreading to the entire population?
        </div>
        <Figure>
          <Grid gridRows={51}
                gridCols={51}
                maxTransmissionRate={1}
                nodeSize={10}
                nug={5}
                randomSeed={99}
                personHours={4}
                showDaysPerStateControls={true}
                showInteractions={false}
                showProTip={true}
                showTransmissionProbabilitySlider={true}
                speed={0.9}
                transmissionProbability={0.5}
                travelRadius={1}
          />
        </Figure>
        <div>
          Q: What's the <em>largest</em> transmission rate where the disease doesn't seem capable of spreading forever (e.g., reaching all four edges of the grid)?
        </div>
        <div style={{marginLeft: '2em'}}>
          {showSpoilerButton}
        </div>
        <div>
          In my experiments, it seems to be around <span className={spoilerOrNot}>0.35</span>, maybe <span className={spoilerOrNot}>0.34</span>. Below that, I've seen the infection fizzle out every time. Above, it generally infects most of the grid.
        </div>
        <div>
          Here's how transmission works in our disease model.
        </div>
        <div>
          Every day, each person has a fixed number of <strong>encounters</strong> with the people nearby.
        </div>
        <div>
          Thus far, we've allowed people to interact only with their immediate neighbors, for a total of 4 encounters per day. We'll vary these assumptions below.
        </div>
        <div>
          During each encounter, the transmission rate determines the probability that an {infected} person will give the disease to a {susceptible} person. The higher the transmission rate, the more likely the disease gets passed along.
        </div>
        <div>
          In reality, there are many different types of encounters. You might brush past someone on the sidewalk. Or sit next to them on a bus. Perhaps you'll share an ice cream cone. Each of these encounters would result in a different probability of transmitting the infection. But in our model, for simplicity, all encounters share the same transmission rate.
        </div>
        <div>
          ——
        </div>
        <div>
          As you continue playing with these simulations (above and below) and thinking about their relevance to coronavirus/COVID-19, here's something to keep in mind:
        </div>
        <div>
          Transmission rate is partly a function of the <em>disease itself</em> (how naturally infectious it is), but also a function of the <em>environment</em> that the disease lives in. This includes both the physical environment (e.g., air temperature and humidity) as well as the social environment (e.g., people's behaviors).
        </div>
        <div>
          For example, when people wash their hands and wear masks to contain coughs, the transmission rate per encounter goes down — even if the virus itself doesn't change.
        </div>
        <div>
          Now, for any viral-growth process, it's possible to find a transmission rate low enough to completely stop the spread. This is called the "critical threshold," and you can learn more about it <a href="https://meltingasphalt.com/interactive/going-critical">here</a>.
        </div>
        <div>
          But COVID-19 is so infectious, it's hard to get below the critical transmission rate. We can only wash our hands so many times a day. Even wearing masks out in public won't be enough enough to bring transmission down far enough (though every inch is helpful).
        </div>
        <div>
          We <em>could</em> all wear hazmat suits every time we leave the house; technically that would solve the transmission problem (without changing our patterns of social interaction). But since that's, uh, impractical, let's consider other ways to keep this disease from consuming us.
        </div>
        <div>
          <h3>Travel</h3>
        </div>
        <div>
          Here's another unrealistic assumption we've been making: we've been allowing people to interact only with their immediate neighbors.
        </div>
        <div>
          What happens when we let people travel farther afield? (We're still assuming 4 encounters per day, a parameter we'll expose in the next section.)
        </div>
        <div>
          As you pull the <strong>travel radius</strong> slider below, you'll see a sample of the encounters that the center person will have on any given day. (We can't draw <em>everyone's</em> encounters because it would get too crowded. You'll just have to use your imagination.) Note that in our model, unlike in real life, each day brings a new (random) set of encounters.
        </div>
        <Figure>
          <Grid degree={24}
                gridRows={51}
                gridCols={51}
                maxTransmissionRate={1}
                nodeSize={10}
                nug={5}
                personHours={4}
                randomSeed={99}
                showAliveFraction={true}
                showInteractions={true}
                // showTransmissionProbabilitySlider={true}
                showTravelRadiusSlider={true}
                speed={0.8}
                travelRadius={15}
          />
        </Figure>
        <div>
          Note that if you restrict travel from the beginning (e.g., to a radius of 2 units), you can slow the infection down a great deal.
        </div>
        <div>
          But what happens when you start with unrestricted travel, let the infection spread pretty much everywhere, and only restrict travel <em>later</em>?
        </div>
        <div>
          In other words, how early in the infection curve do you have to curtail travel in order for it to meaningful slow the outbreak?
        </div>
        <div>
          Go ahead, try it. Start with a travel radius of 25. Then play the simulation, pausing when you get to about 10 percent infected. Then reduce the travel radius to 2 and play it out. What happens?
        </div>
        <div>
          Takeaway: travel restrictions are most useful when they're applied early, at least for the purpose of flattening the curve. (So let's get them in place!)
        </div>
        <div>
          But travel restrictions can help even in the later stages of an outbreak, for at least two reasons:
        </div>
        <div>
          <ol>
            <li>Buses, trains, and airports are places where people gather together in cramped quarters. When people stop using these modes of transport, they reduce the number of encounters they have with potentially infected people. (We'll explore this more below.)</li>
            <li>Reducing travel is critical <em>in concert with regional containment measures</em>. If one region gets the outbreak under control, but neighboring regions are still on fire, you have to protect the controlled region. (We're not going to explore containment measures in this article, but they may be important soon, and if you're interested, you might start <a href="https://necsi.edu/beyond-contact-tracing">here</a>.)</li>
          </ol>
        </div>
        <div>
          <h3>Number of encounters</h3>
        </div>
        <div>
          Alright, let's really open this thing up.
        </div>
        <div>
          In the simulation below, you can vary the <strong>encounters per day</strong>.
        </div>
        <div>
          Let's start at 20. What's the minimum value we need to keep the outbreak contained?
        </div>
        <Figure>
          <Grid degree={24}
                gridRows={51}
                gridCols={51}
                personHours={20}
                nodeSize={10}
                nug={5}
                randomSeed={100}
                showAliveFraction={true}
                showInteractions={true}
                showPersonHoursSlider={true}
                showTransmissionProbabilitySlider={true}
                showTravelRadiusSlider={true}
                speed={0.8}
                transmissionProbability={0.3}
                travelRadius={10}
          />
        </Figure>
        {/*<div>*/}
        {/*  Here's another question you might try to answer: <em>For a fixed number of encounters (e.g., 5 per day), how much do you need to reduce the travel radius to keep the disease in check?</em>*/}
        {/*</div>*/}
        <div>
          As you can see, reducing encounters per day has a <em>dramatic effect</em> on the outbreak. It easily flattens the curve, and even has the potential (when taken very seriously) to completely quench an outbreak.
        </div>
        <div>
          This is the effect we're hoping for when we call for "social distance." This is why so many people are pleading with their officials to stop the parades and close the schools, and why all of us should stay away from bars and coffee shops and restaurants, and work from home as much as possible.
        </div>
        <div>
          The NBA did their fans a tremendous service by canceling the rest of the season. Now we need to follow suit and <em>cancel everything</em>.
        </div>
        <div>
          In my understanding (again, not an expert), this is the single most important lever we have for fighting this thing.
        </div>
        <div>
          <h3>Chance of self-isolation/quarantine after exhibiting symptoms</h3>
        </div>
        <div>
          In the simulation below, you can vary the <strong>likelihood of someone self-isolating after exhibiting symptoms</strong>. Additionally, you can vary how strict they are with that self-isolation
        </div>
        <div>
          Let's start the chance of isolation at 50% and the amount of isolation at 50%. What are the minimum values we need to keep the outbreak contained?
        </div>
        <Figure>
          <Grid degree={24}
                gridRows={51}
                gridCols={51}
                personHours={20}
                nodeSize={10}
                nug={5}
                randomSeed={100}
                showAliveFraction={true}
                showInteractions={true}
                showPersonHoursSlider={true}
                showTransmissionProbabilitySlider={true}
                showChanceOfIsolationAfterSymptomsSlider={true}
                showDecreaseInEncountersAfterSymptomsSlider={true}
                showTravelRadiusSlider={true}
                speed={0.8}
                transmissionProbability={0.3}
                travelRadius={10}
          />
        </Figure>
        <div>
          As you can see, as people begin to exhibit symptoms, if they voluntarily self-isolate and do a good job of that isolation, the spread can be mitigated fairly well. Unfortunately, if less than half the population self-isolates, the effects are fairly minimal.
        </div>
        <div>
          Hint: try setting the chance of isolation to various levels above 50% and try various levels of self-isolation to see how the curve flattens immensely for high values
        </div>
        <div>
          <h3>Death</h3>
        </div>
        <div>
          Not every patient recovers from a disease. Many end up {dead}.
        </div>
        <div>
          Enter the <strong>fatality rate</strong>.
        </div>
        <div>
          In our simulation, fatality rate is the probability that a patient who gets infected will ultimately die of the infection, assuming they get normal/adequate medical care.
        </div>
        <div>
          <span className="deemphasized">(Update: an earlier version of this article made a distinction between case fatality rate and mortality rate, but failed to define the terms correctly. Collapsing this distinction and using the term "fatality rate" instead.)</span>
        </div>
        <div>
          The fatality rate for COVID-19 has been estimated between 1 percent and <a href="https://www.thelancet.com/journals/laninf/article/PIIS1473-3099(20)30195-X/fulltext">6 percent</a>. It might turn out to be lower than 1 percent, if there are a lot of undiagnosed cases. It's definitely higher when the medical system is overburdened (more on that in a minute).
        </div>
        <div>
          We'll start at a 3 percent fatality rate for our disease model, but you can vary the parameter below:
        </div>
        <Figure>
          <Grid gridRows={101}
                gridCols={101}
                nodeSize={5}
                nug={5}
                randomSeed={100}
                showAliveFraction={true}
                showDeaths={true}
                showDeathRateSlider={true}
                showPersonHoursSlider={true}
                showTransmissionProbabilitySlider={true}
                showTravelRadiusSlider={true}
                speed={1}
                transmissionProbability={0.3}
          />
        </Figure>
        <div>
          Those scattered black dots may not look like much. But remember, each is a human life lost to the disease.
        </div>
        <div>
          <h3>Hospital capacity</h3>
        </div>
        <div>
          Below you'll find one last new slider. It controls <strong>hospital capacity</strong>.
        </div>
        <div>
          This is the number of patients (expressed as a percentage of the population) that can be treated by our medical system at any one time.
        </div>
        <div>
          Why does hospital capacity matter?
        </div>
        <div>
          When there are more patients than the system can handle, they can’t get the treatment they need. And as a result, they have significantly worse outcomes. As we've seen in Italy, some may be left to die in the hallways.
        </div>
        <div>
          I've heard people speak of hospital capacity as the “number of beds,” or “number of ICU beds.” My take is that mere "beds" can be set up in a gymnasium on very short notice. I think the real bottleneck is medical equipment — specifically ventilators. But I'm not sure. Maybe it’s medical personnel.
        </div>
        <div>
          In reality, this matters <em>a lot</em>. We need to identify what the bottleneck is, and do our best to alleviate pressure there. But for a simulation, we can just wave our hands and assume there's limited capacity somewhere in the system. Remember, we're not trying to model reality too carefully.
        </div>
        <div>
          In our disease model, here's how the medical system breaks:
        </div>
        <div>
          <strong>When there are more infections than hospital capacity, the fatality rate <em>doubles</em>.</strong>
        </div>
        <div>
          Give it a try. Pay special attention to the <em>input fatality rate</em> (the value on the slider), which defines how often people die even in the best circumstances, vs. the <em>actual death rate</em> (highlighted below the chart), which tells us how the system behaves under strain.
        </div>
        <Figure>
          <Grid gridRows={101}
                gridCols={101}
                hospitalCapacityPct={0.05}
                nodeSize={5}
                nug={5}
                personHours={15}
                randomSeed={100}
                showAliveFraction={true}
                showDeaths={true}
                showDeathRateSlider={true}
                showHospitalCapacitySlider={true}
                // showPersonHoursSlider={true}
                // showTransmissionProbabilitySlider={true}
                // showTravelRadiusSlider={true}
                speed={1}
                transmissionProbability={0.28}
                travelRadius={15}
          />
        </Figure>
        <div>
          <h3>"Flatten the curve"</h3>
        </div>
        <div>
          You've heard this before. You know why it's important. But now you're about to get a feel for it.
        </div>
        <div>
          This is your final test today.
        </div>
        <div>
          The input fatality rate is fixed at 3 percent. Hospital capacity is fixed at 5 percent.
        </div>
        <div>
          Play out the simulation and note the actual death rate: 6 percent. Then try to bring that number down.
        </div>
        <div>
          In other words, flatten the curve:
        </div>
        <Figure>
          <Grid gridRows={101}
                gridCols={101}
                hospitalCapacityPct={0.05}
                nodeSize={5}
                nug={5}
                personHours={15}
                randomSeed={100}
                showAliveFraction={true}
                showDeaths={true}
                // showDeathRateSlider={true}
                // showHospitalCapacitySlider={true}
                showPersonHoursSlider={true}
                showTransmissionProbabilitySlider={true}
                showTravelRadiusSlider={true}
                speed={1}
                transmissionProbability={0.4}
                travelRadius={15}
          />
        </Figure>
        <div>
          However this worked out for you in simulation, reality is going to be <em>so much harder</em>. Real people don't respond like sliders in a UI.
        </div>
        <div>
          And here's the kicker: even if we manage to "flatten the curve" enough to meaningfully space out the case load, we're still positioned to lose millions and millions of lives.
        </div>
        <div>
          Maybe we won't lose as many as a worst-case scenario; maybe we won't lose them in hospital hallways. But as long as the virus continues to spread — which it shows every sign of doing — there's an unthinkable amount of suffering in our future.
        </div>
        <div>
          Unless we do the right things today.
        </div>
        <div>
          Stop traveling. Stop going out. Stop visiting your parents and your friends. Stop eating at restaurants. Pause everything you possibly can. If you're in charge of things, <em>cancel them</em>. Lock. It. All. Down.
        </div>
        <div>
          Please: take decisive action now.
        </div>
        <div>
          COVID-19 is coming for us, and it won't be stopped by half-measures.
        </div>




        <div>
          &nbsp;
        </div>
        <div>
          &nbsp;
        </div>
        <div>
          ——
        </div>
        <div>
          &nbsp;
        </div>
        {/*<div>*/}
        {/*  Thanks for reading. If this has been helpful, I hope you'll consider sharing.*/}
        {/*</div>*/}
        <div>
          <b>License</b>
        </div>
        <div>
          <a href="https://creativecommons.org/share-your-work/public-domain/cc0/">CC0</a> — no rights reserved. You're free to use this work however you see fit, including copying it, modifying it, and distributing it on your own site.
        </div>
        <div>
          <a href="https://github.com/kevinsimler/outbreak">Source code</a>
        </div>
        <div>
          <b>Full model</b>
        </div>
        <div>
          The full model, with all sliders exposed, can be found at the very bottom of the page.
        </div>
        <div>
          <b>Acknowledgments</b>
        </div>
        <div>
          I'd like to thank <a href="https://twitter.com/nsbarr">Nick Barr</a>, <a href="https://twitter.com/origiful">Ian Padgham</a>, <a href="https://twitter.com/frooblor">Diana Huang</a>, Kellie Jack, <a href="https://twitter.com/btnaughton">Brian Naughton</a>, <a href="https://twitter.com/yaneerbaryam">Yaneer Bar-Yam</a>, and <a href="https://twitter.com/adamdangelo">Adam D'Angelo</a> for helpful feedback and encouragement.
        </div>
        <div>
          <b>Further reading</b>
        </div>
        <div>
          <ul>
            <li><a href="https://medium.com/@tomaspueyo/coronavirus-act-today-or-people-will-die-f4d3d9cd99ca">Coronavirus: Why You Must Act Now</a> — Tomas Pueyo explains why we've been systematically underestimating this thing, and why that needs to change. Just read it.</li>
            <li><a href="https://medium.com/@joschabach/flattening-the-curve-is-a-deadly-delusion-eea324fe9727">Don’t "Flatten the Curve," Stop It!</a> — Joscha Bach does some calculations on hospital capacity and concludes that "flattening the curve" won't be enough; we have to completely stop the outbreak.</li>
            <li>The Washington Post's <a href="https://www.washingtonpost.com/graphics/2020/world/corona-simulator/">excellent simulation</a> — brilliant use of billiard balls to show transmission and social distancing.</li>
            <li><a href="https://meltingasphalt.com/interactive/going-critical/">Going Critical</a> — my previous exploration of diffusion and viral growth processes, including the nuclear reactions and the growth of knowledge.</li>
          </ul>
        </div>

        {this.renderEndOfPostDivider(true)}

        <div className="subscription-footer">
          <a href="https://meltingasphalt.com"><strong>Melting Asphalt</strong></a> is maintained by <span className="nohyphen">Kevin</span> <span className="nohyphen">Simler</span>.<br/><br/> I publish <em>very infrequently</em>, so you might want to get notified about new posts:<br/>
          {this.renderSubscribeForm()}
          {/*<div style={{textAlign: 'center', fontSize: '10pt', color: '#666', marginTop: '0.5em'}}>(This is a <em>very low frequency</em> mailing list. Pinky swear.)</div>*/}
          <br/>You can also <a href="https://twitter.com/KevinSimler"><strong>find me on Twitter</strong></a>.
          <div>&nbsp;</div>
        </div>




        <div>
          &nbsp;
        </div>
        <div>
          <h3>Full model</h3>
        </div>
        <Figure>
          <Grid gridRows={101}
                gridCols={101}
                // highlight="transmissionRate"
                hospitalCapacityPct={0.05}
                nodeSize={5}
                nug={5}
                randomSeed={100}
                showAliveFraction={true}
                showAllControls={true}
                // showDaysPerStateControls={true}
                showDeaths={true}
                // showPersonHoursSlider={true}
                // showTransmissionProbabilitySlider={true}
                // showTravelRadiusSlider={true}
                speed={1}
          />
        </Figure>

      </div>
    );
  }

  renderSubscribeForm() {
    return (
      <form method="post" action="https://meltingasphalt.us8.list-manage.com/subscribe/post?u=0bc9d741e167733d20c520ea6&amp;id=57ebd9b4a6" id="mc4wp-form-1" className="form mc4wp-form"><input type="email" id="mc4wp_email" name="EMAIL" placeholder="Enter your email" required />
        <input type="submit" value="Subscribe" />
        <textarea name="_mc4wp_required_but_not_really" style={{display: "none"}}/><input type="hidden" name="_mc4wp_form_submit" value="1" /><input type="hidden" name="_mc4wp_form_instance" value="1" /><input type="hidden" name="_mc4wp_form_nonce" value="8a45344b67" />
      </form>
    )
  }

  renderEndOfPostDivider(showTimestamp: boolean) {
    let timestamp = "";
    let divider = <span>——</span>;
    if (showTimestamp) {
      timestamp = "Originally published March 16, 2020.";
      divider = <img src="https://meltingasphalt.com/wp-content/themes/responsive/core/images/flourish.svg" width={50} alt="——" />;
    }

    return (
      <div style={{textAlign: "center"}}>
        <div className="end-of-post-divider">
          {divider}
        </div>
        <div className="signature-line">
          {timestamp}
        </div>
      </div>
    );
  }

  renderHeader() {
    return (
        <div id="header">
          <div id="logo" className="branded">
            <span className="site-name">
              <a href="https://meltingasphalt.com/" title="Melting Asphalt" rel="home">
                <img id="nav-logo" src="https://meltingasphalt.com/wp-content/themes/responsive/core/images/ma.svg" />
                                        &nbsp;&nbsp;Melting Asphalt
              </a>
            </span>
          </div>
        </div>
    );
  }

  render() {
    return (
      <div className="main-container">
        <div className="header">
          {this.renderHeader()}
        </div>
        <div className="blank-l"/>
        <div className="content">
          {this.renderMainPost()}
        </div>
        <div className="blank-r"/>
        <div className="footer"/>
      </div>
    );
  }
}

export default App
