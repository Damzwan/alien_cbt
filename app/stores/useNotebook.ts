import {defineStore} from 'pinia';
import {ref} from 'vue';

export const useNotebookStore = defineStore('notebook', () => {
    // --- State ---
    const isOpen = ref(false);
    const insights = ref<string[]>([]);
    const stacks = ref<any[]>([]);

    const selectedDistortions = ref([]);
    const recommendations = ref('');



    // --- Actions ---
    const toggle = () => {
        isOpen.value = !isOpen.value;
    };

    const addNote = (text: string, sessionNumber: number) => {
        console.log(text);

        // Basic validation and duplicate prevention
        if (!text || insights.value.includes(text)) return;


        insights.value.push(text);
        stacks.value.push({
            id: Math.random(),
            fragments: [text],
            linkedPatternId: null,
            connectionNote: '',
            session: sessionNumber
        });
    };

    const removeInsight = (text: string) => {
        // Remove from flat list tracking
        insights.value = insights.value.filter(i => i !== text);

        // Filter fragments within stacks and remove empty stacks
        stacks.value = stacks.value
            .map(stack => ({
                ...stack,
                fragments: stack.fragments.filter((f: string) => f !== text)
            }))
            .filter(stack => stack.fragments.length > 0);
    };

    const mergeStacks = (draggedIdx: number, targetIdx: number) => {
        const dragged = stacks.value[draggedIdx];
        if (!dragged) return;

        stacks.value[targetIdx].fragments.push(...dragged.fragments);
        stacks.value.splice(draggedIdx, 1);
    };

    const pullOutFragment = (stackIdx: number, fragIdx: number) => {
        const stack = stacks.value[stackIdx];
        if (!stack) return;

        const text = stack.fragments[fragIdx];
        const session = stack.session;

        // Remove from current group
        stack.fragments.splice(fragIdx, 1);

        // Create a new independent stack for this fragment
        stacks.value.push({
            id: Math.random(),
            fragments: [text],
            linkedPatternId: null,
            connectionNote: '',
            session: session
        });
    };

    return {
        isOpen,
        insights,
        stacks,
        toggle,
        addNote,
        removeInsight,
        mergeStacks,
        pullOutFragment,
        selectedDistortions,
        recommendations
    };
});