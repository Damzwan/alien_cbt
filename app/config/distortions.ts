export interface DistortionCard {
    id: string;
    title: string;
    clinicalName: string;
    description: string;
    example: string;
    counterExample: string;
    generalCounters: string[];
    therapistTip: string;
    image: string;
}

export const distortionCards: DistortionCard[] = [
    {
        id: 'catastrophizing',
        title: 'Catastrophizing',
        clinicalName: 'Magnification & Minimization',
        description: 'Assuming the absolute worst-case scenario will happen, despite having little to no evidence for it.',
        example: 'If I fail this presentation, my entire GPA is ruined and I will never find a decent job after graduation.',
        counterExample: 'Even if I fail this presentation, I have other classes and can SURVIVE. What is the most likely middle ground here?',
        generalCounters: [
            'What is the *most likely* outcome, not just the worst?',
            'What evidence do I have that this specific doom will occur?'
        ],
        therapistTip: 'Clinical Goal: Decatastrophizing. Guide the subject to assess the mathematical probability of the "Doom Scenario." It is usually very low. Pivot to a "Most Likely" outcome plan.',
        image: '/distortions/catastrophizing.png'
    },
    {
        id: 'all-or-nothing',
        title: 'All-or-Nothing',
        clinicalName: 'Dichotomous Thinking',
        description: 'Seeing things in binary extremes. If a performance is not 100% perfect, it is categorized as a 0% failure.',
        example: 'I was late for work one time this year. I am an unreliable person and should just quit.',
        counterExample: 'One mistake does not negate a year of consistency. Perfect attendance is not the only metric of success.',
        generalCounters: [
            'Where does this situation fall on a scale of 0 to 100?',
            'Is there any gray area I am ignoring?'
        ],
        therapistTip: 'Clinical Goal: Introducing the Continuum. Force the subject to place their "failure" on a numerical scale (0–100). Is it a 0, or is it a 75?',
        image: '/distortions/all-or-nothing.png'
    },
    {
        id: 'mind-reading',
        title: 'Mind Reading',
        clinicalName: 'Arbitrary Inference',
        description: 'Believing you know what others are thinking or feeling, particularly regarding yourself, without asking them.',
        example: 'My friend hasn\'t texted back. They definitely think I\'m too needy and want to end the friendship.',
        counterExample: 'I cannot know why they haven\'t texted. Maybe they are busy. I can wait, or just ask directly.',
        generalCounters: [
            'What physical evidence do I have for this thought?',
            'Thoughts are not facts. Is there another possible explanation?'
        ],
        therapistTip: 'Clinical Goal: Verification. Remind the subject that anxiety is not a psychic ability. Require them to identify one alternative motive for the friend’s behavior.',
        image: '/distortions/mind-reading.png'
    },
    {
        id: 'emotional-reasoning',
        title: 'Emotional Reasoning',
        clinicalName: 'Affective Realism',
        description: 'Assuming that because you *feel* a certain way, that feeling must reflect objective reality.',
        example: 'I am terrified of flying on an airplane, so flying must be inherently dangerous.',
        counterExample: 'I am experiencing anxiety, but the statistical safety of flying has not changed based on my mood.',
        generalCounters: [
            'Am I responding to a feeling or a fact?',
            'Can I label this emotion without confusing it with my identity?'
        ],
        therapistTip: 'Clinical Goal: Differentiation. Force the subject to label the emotion as a separate entity: "I am having the *feeling* of danger," which removes the "fact" requirement.',
        image: '/distortions/emotional-reasoning.png'
    },
    {
        id: 'overgeneralization',
        title: 'Overgeneralization',
        clinicalName: 'Pattern Overload',
        description: 'Using a single negative event as a universal pattern, often using the words "always" or "never."',
        example: 'The person I went on one date with said "no thanks" to a second. I am ALWAYS rejected. NOBODY will ever love me.',
        counterExample: 'One person was not a good match. This does not predict my entire romantic future.',
        generalCounters: [
            'What specific data point am I using to make this wide prediction?',
            'When has the opposite outcome happened in my life?'
        ],
        therapistTip: 'Clinical Goal: Pattern Disruption. Search for "Counter-Examples." Require the subject to name one time when the "Always" or "Never" rule was false.',
        image: '/distortions/overgeneralization.png'
    },
    {
        id: 'personalization',
        title: 'Personalization',
        clinicalName: 'External Attribution Error',
        description: 'Assuming you are the cause of events outside of your control or taking generic events as directed at you.',
        example: 'The team meeting was a disaster; it’s my fault because I should have researched the topic more.',
        counterExample: 'I prepared my section. I am not responsible for the entire environment or the poor research of others.',
        generalCounters: [
            'What factors are outside of my control in this situation?',
            'If this event happened to a friend, would I blame them for it?'
        ],
        therapistTip: 'Clinical Goal: Distributing Responsibility. Use the "Pie Chart Technique." Force the subject to allocate responsibility percentages to *all* possible actors/environments (them, colleagues, tech issues, bad luck).',
        image: '/distortions/personalization.png'
    },
    {
        id: 'should-statements',
        title: 'Should Statements',
        clinicalName: 'Imperative Demands',
        description: 'Placing rigid "musts" and "shoulds" on yourself, others, or the world, leading to guilt, anxiety, or resentment.',
        example: 'I should have finished this project by now. What is wrong with me?',
        counterExample: 'I would prefer to have finished, but it is acceptable that I am still working. I am not failing; I am processing.',
        generalCounters: [
            'How does this "Should" improve my situation or motivation?',
            'What if I replaced "Should" with "I would prefer to..."?'
        ],
        therapistTip: 'Clinical Goal: Semantic Substitution. Lower the stakes. Replace rigid imperatives with expressions of preference ("I would like..."), which reduces the "Internal Critic."',
        image: '/distortions/should-statements.png'
    },
    {
        id: 'mental-filtering',
        title: 'Mental Filtering',
        clinicalName: 'Selective Abstraction',
        description: 'Focusing exclusively on one negative detail of an event and ignoring the entire positive or neutral context.',
        example: 'The presentation was a disaster because I stuttered *once* during the introduction.',
        counterExample: 'I received positive feedback on my specific insights and answered every question accurately. The event as a whole was successful.',
        generalCounters: [
            'Am I overlooking 99 positive data points to fixate on one negative one?',
            'What would a neutral observer say about this event?'
        ],
        therapistTip: 'Clinical Goal: Contextual Awareness. Require the subject to "Zoom Out" and describe the entire event from the perspective of a neutral third-party observer, making them include the positives.',
        image: '/distortions/mental-filtering.png'
    },
    {
        id: 'discounting-positive',
        title: 'Discounting the Positive',
        clinicalName: 'Positive Feedback Refusal',
        description: 'Dismissing or invalidating positive experiences by insisting they "don\'t count" or are purely accidental.',
        example: 'They complimented my presentation, but they were probably just being polite. It wasn\'t actually good.',
        counterExample: 'They chose to provide specific praise. I did a good job. I will allow myself to accept this.',
        generalCounters: [
            'What is the logical evidence for dismissively invalidating this accomplishment?',
            'How does this dismissal serve my mental stability?'
        ],
        therapistTip: 'Clinical Goal: Accrual. Challenge the "Yes, but..." reflex. Require the subject to sit with a compliment for 10 seconds before being allowed to dismiss it.',
        image: '/distortions/discounting-positive.png'
    },
    {
        id: 'labeling',
        title: 'Labeling',
        clinicalName: 'Self-Identity Reduction',
        description: 'Using a simplified, global, negative label for yourself ("I am a failure") instead of describing a specific behavior ("I made a mistake").',
        example: 'I made an error on my tax return. I am a total failure and a loser.',
        counterExample: 'I made a single bureaucratic error. I am capable and can resolve this situation.',
        generalCounters: [
            'Does this label ("failure") accurately describe my *entire* existence, 24/7?',
            'How is "I made an error" different from "I *am* an error"?'
        ],
        therapistTip: 'Clinical Goal: Identity Separation. We are treating "Identity Hardlinking." The person is not the problem; the behavior or the situation is the problem. Require them to describe the *event*, not their *character*.',
        image: '/distortions/labeling.png'
    }
];