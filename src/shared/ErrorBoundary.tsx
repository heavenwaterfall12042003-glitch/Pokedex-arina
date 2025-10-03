import { Component, type ReactNode } from "react";

type Props = { children: ReactNode; fallback?: ReactNode };
type State = { hasError: boolean; message?: string };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(err: unknown): State {
    return {
      hasError: true,
      message: err instanceof Error ? err.message : String(err),
    };
  }
  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <p style={{ color: "#b91c1c" }}>
            Произошла ошибка: {this.state.message}
          </p>
        )
      );
    }
    return this.props.children;
  }
}
