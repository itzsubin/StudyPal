export interface NoteContent {
    type: 'heading' | 'paragraph' | 'bullet';
    text: string;
}

export interface SmartNote {
    id: number;
    title: string;
    topics: string[];
    content: NoteContent[];
}
