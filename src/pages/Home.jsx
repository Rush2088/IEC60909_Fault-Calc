import { useMemo, useState } from "react";
import ResultsCard from "../components/ResultsCard";
import {
  DEFAULT_VALUES,
  calculateFaultLevel,
  validateInputs,
} from "../utils/faultUtils";

export default function Home() {
  const [draftValues, setDraftValues] = useState(DEFAULT_VALUES);
  const [values, setValues] = useState(DEFAULT_VALUES);

  const { result, error } = useMemo(() => {
    const validation = validateInputs(values);

    if (!validation.valid) {
      return { result: null, error: validation.message };
    }

    const { gridKA, hvKV, lvKV, txMVA, txZ, cFactor } = validation.parsed;

    return {
      result: calculateFaultLevel(gridKA, hvKV, lvKV, txMVA, txZ, cFactor),
      error: "",
    };
  }, [values]);

  function handleCalculate() {
    setValues(draftValues);
  }

  function handleReset() {
    setDraftValues(DEFAULT_VALUES);
    setValues(DEFAULT_VALUES);
  }

  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-[760px]">
        <ResultsCard
          values={values}
          draftValues={draftValues}
          setDraftValues={setDraftValues}
          onCalculate={handleCalculate}
          onReset={handleReset}
          result={result}
          error={error}
        />
      </div>
    </main>
  );
}