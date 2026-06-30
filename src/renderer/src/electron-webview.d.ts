declare namespace JSX {
  interface IntrinsicElements {
    webview: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        src?: string
        partition?: string
        useragent?: string
        allowpopups?: boolean
        nodeintegration?: boolean
        webpreferences?: string
        preload?: string
        style?: React.CSSProperties
      },
      HTMLElement
    >
  }
}
