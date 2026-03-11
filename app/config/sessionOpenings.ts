const SESSION_OPENINGS = [
    "{name} is staring out the window, lost in thought.",
    "{name} is fidgeting with a loose thread on their sleeve.",
    "{name} avoids eye contact, shifting uncomfortably in the chair.",
    "{name} takes a deep breath and looks at the floor.",
    "{name} is tracing the patterns on the rug with their eyes.",
    "{name} sits in silence, waiting for you to begin.",
    "{name} looks slightly more composed than last time, but remains quiet.",
    "{name} is tapping a rhythmic pattern on the armrest."
];

export const getRandomOpening = (characterName: string) => {
    const randomIndex = Math.floor(Math.random() * SESSION_OPENINGS.length);
    // @ts-ignore
    return SESSION_OPENINGS[randomIndex].replace("{name}", characterName);
};