"use client";

import dynamic from "next/dynamic";

type RichTextEditorProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const EditorClient = dynamic(
  async () => {
    const [{ CKEditor }, ClassicEditor] = await Promise.all([
      import("@ckeditor/ckeditor5-react"),
      import("@ckeditor/ckeditor5-build-classic")
    ]);

    return function Editor({
      value,
      onChange,
      placeholder
    }: Omit<RichTextEditorProps, "label">) {
      return (
        <CKEditor
          editor={ClassicEditor.default as never}
          data={value}
          config={{
            placeholder
          }}
          onChange={(_, editor) => {
            onChange((editor as { getData: () => string }).getData());
          }}
        />
      );
    };
  },
  {
    ssr: false,
    loading: () => (
      <div className="min-h-40 rounded-[24px] border border-line bg-white px-5 py-4 text-sm text-steel">
        Đang tải trình soạn thảo...
      </div>
    )
  }
);

export function RichTextEditor({ label, value, onChange, placeholder }: RichTextEditorProps) {
  return (
    <div className="grid gap-2">
      <span className="text-sm font-medium text-ink">{label}</span>
      <div className="admin-ck-editor rounded-[24px] border border-line bg-white">
        <EditorClient value={value} onChange={onChange} placeholder={placeholder} />
      </div>
    </div>
  );
}
