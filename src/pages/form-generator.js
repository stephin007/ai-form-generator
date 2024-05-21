import dynamic from "next/dynamic";

const DynamicFormGenerator = dynamic(() => import("../components/FormGenerator"));

export default function Home() {
  return (
    <>
        <DynamicFormGenerator />
    </>
  );
}
