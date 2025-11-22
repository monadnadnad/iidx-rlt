import { render, screen } from "@testing-library/react";
import { PropsWithChildren } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";

import { SearchFormValues } from "../../types";
import { PatternInput } from "./PatternInput";

describe("PatternInput", () => {
  const FormWrapper: React.FC<PropsWithChildren> = ({ children }) => {
    const methods = useForm<SearchFormValues>();
    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  it("1P設定で必要な入力欄が表示される", () => {
    render(
      <FormWrapper>
        <PatternInput playSide="1P" />
      </FormWrapper>
    );

    expect(screen.getByLabelText("左側の3つが")).toBeInTheDocument();
    expect(screen.getByLabelText("右側の4つが")).toBeInTheDocument();
  });

  it("2P設定で必要な入力欄が表示される", () => {
    render(
      <FormWrapper>
        <PatternInput playSide="2P" />
      </FormWrapper>
    );

    expect(screen.getByLabelText("左側の4つが")).toBeInTheDocument();
    expect(screen.getByLabelText("右側の3つが")).toBeInTheDocument();
  });
});
