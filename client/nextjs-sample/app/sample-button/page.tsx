import ContainedButton from "@client-common/components/inputs/Buttons/ContainedButton";

export default function SampleButtonPage() {
  return (
    <div>
      <h1>Sample Button Page</h1>
      <ContainedButton onClick={() => alert("Button clicked!")}>Click Me</ContainedButton>
    </div>
  );
}
