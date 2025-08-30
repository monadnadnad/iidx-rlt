import { render, screen } from "@testing-library/react";
import { PropsWithChildren } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";

import { SearchFormValues } from "../../../schema";
import { useSettingsStore } from "../../../state/settingsStore";
import { PlaySide } from "../../../types";
import { TicketSearchForm } from "./TicketSearchForm";

describe("TicketSearchForm", () => {
  const FormWrapper: React.FC<PropsWithChildren<{ playSide: PlaySide }>> = ({ children, playSide }) => {
    const methods = useForm<SearchFormValues>();
    useSettingsStore.setState({ playSide });
    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  it("1P設定で必要な入力欄が正しく表示される", () => {
    render(
      <FormWrapper playSide="1P">
        <TicketSearchForm />
      </FormWrapper>
    );

    expect(screen.getByRole("group", { name: /左側の3つが/i })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: /右側の4つが/i })).toBeInTheDocument();
  });

  it("2P設定で必要な入力欄が正しく表示される", () => {
    render(
      <FormWrapper playSide="2P">
        <TicketSearchForm />
      </FormWrapper>
    );

    expect(screen.getByRole("group", { name: /右側の3つが/i })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: /左側の4つが/i })).toBeInTheDocument();
  });
});
