import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Investomania ErrorBoundary caught error]:', error, errorInfo);
    
    // Auto-recover from chunk loading errors (e.g., after a new deployment or cache invalidation)
    const isChunkError =
      error?.name === 'ChunkLoadError' ||
      /Loading chunk .* failed/i.test(error?.message || '') ||
      /Failed to fetch dynamically imported module/i.test(error?.message || '');

    if (isChunkError && !sessionStorage.getItem('chunk_retry_attempted')) {
      sessionStorage.setItem('chunk_retry_attempted', '1');
      window.location.reload();
    }
  }

  handleReload = () => {
    try {
      sessionStorage.removeItem('chunk_retry_attempted');
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full min-h-screen flex items-center justify-center p-6 bg-[#5A0D1B] text-[#F8EEE1]">
          <div className="surface-box rounded-3xl p-8 max-w-md w-full text-center space-y-4 border border-[rgba(241,202,126,0.4)] bg-[#701020] shadow-2xl">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#5A0D1B] border border-[#F1CA7E] flex items-center justify-center text-[#F1CA7E] text-2xl font-bold">
              !
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#F1CA7E]">
              Floor Connection Refresh
            </h2>
            <p className="text-xs font-rounded leading-relaxed text-[#E8DCC6]">
              A temporary display sync hiccup occurred during the last frame. Click below to reconnect to the live trading terminal.
            </p>
            <button
              onClick={this.handleReload}
              className="rounded-full px-6 py-2.5 font-rounded font-bold text-sm bg-[#F1CA7E] text-[#5A0D1B] hover:brightness-110 transition-all cursor-pointer shadow-lg w-full"
            >
              Reload Live Floor
            </button>
            <details className="text-[11px] text-[#D5C4AE] text-left pt-2 border-t border-[rgba(241,202,126,0.2)]">
              <summary className="cursor-pointer opacity-70 hover:opacity-100">Technical Diagnostics</summary>
              <pre className="mt-2 p-2 bg-[#5A0D1B] rounded-lg overflow-x-auto text-[10px] font-mono text-[#F1CA7E]">
                {this.state.error?.message || String(this.state.error)}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
