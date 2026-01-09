'use client';

import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(async () => {
    const { default: RQ } = await import('react-quill');
    return ({ forwardedRef, ...props }: any) => {
        const Cmp = RQ as any;
        return <Cmp {...props} ref={forwardedRef} />;
    };
}, { ssr: false });

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export default function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
    return (
        <div className={className}>
            <ReactQuill theme="snow" value={value} onChange={onChange} placeholder={placeholder} />
        </div>
    );
}
