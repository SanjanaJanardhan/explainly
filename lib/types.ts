export type WidgetShape = "process" | "network" | "chart" | "comparison";

export type WidgetType = WidgetShape | "static-fallback" | "text-fallback";

export type FollowUpContext = {
  query: string;
  explanation: string;
};

export type ExplainResponse = {
  query: string;
  explanation: string;
  widgetType: WidgetType;
  widgetHtml?: string;
  widgetSvg?: string;
};

export type ExplainRequest = {
  query: string;
  shape?: WidgetShape;
  context?: FollowUpContext;
};
