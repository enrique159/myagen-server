import mjml from 'mjml';

export const verificationCodeTemplate = (url: string) => {
  const htmlTemplate = mjml(`
    <mjml>
      <mj-head>
        <mj-attributes>
          <mj-text font-family="Helvetica, Arial, sans-serif" />
        </mj-attributes>
      </mj-head>
      <mj-body background-color="#ffffff">
        <mj-section padding="0">
          <mj-column>
            <mj-raw>
              <div style="text-align:center; padding: 20px;">
                <!-- SVG HEADER -->
                <svg xmlns="http://www.w3.org/2000/svg" width="183" height="45" viewBox="0 0 183 45" fill="none">
                  <path d="M33 10.1111V16.4444H30.9091V18.5556H28.8182V20.6667H26.7273V22.7778H24.6364V24.8889H22.5455V27H20.4545V24.8889H18.3636V22.7778H16.2727V20.6667H14.1818V18.5556H12.0909V16.4444H10V10.1111H12.0909V8H18.3636V10.1111H20.4545V12.2222H22.5455V10.1111H24.6364V8H30.9091V10.1111H33Z" fill="#F02367"/>
                  <path d="M36.9 32.7273H38.95V30.6818H41V2.04545H38.95V0H4.1V2.04545H2.05V4.09091H0V40.9091H2.05V42.9545H4.1V45H38.95V42.9545H41V40.9091H38.95V38.8636H36.9V32.7273ZM32.8 40.9091H6.15V38.8636H4.1V34.7727H6.15V32.7273H32.8V40.9091ZM4.1 4.09091H36.9V28.6364H4.1V4.09091Z" fill="#4872E5"/>
                  <path d="M166.878 31.396V15.952H179.418V18.922H182.421V31.396H178.758V19.648H170.508V31.396H166.878Z" fill="#3C4151"/>
                  <path d="M150.319 31.396V28.459H147.349V18.922H150.319V15.952H159.889V18.922H162.892V22.585H159.229V19.648H150.979V21.793H156.919V25.522H150.979V27.7H159.229V24.697H162.892V28.426H159.889V31.396H150.319Z" fill="#3C4151"/>
                  <path d="M131.789 37.237V34.333H128.819V30.637H132.449V33.541H140.732V28.459H131.789V25.522H128.819V18.922H131.789V15.952H141.392V18.922H144.362V34.333H141.392V37.237H131.789ZM132.449 24.73H140.732V19.648H132.449V24.73Z" fill="#3C4151"/>
                  <path d="M110.938 31.396V28.459H107.968V18.922H110.938V15.952H120.508V18.922H123.511V27.7H126.481V31.396H122.851V28.459H120.508V31.396H110.938ZM111.598 27.7H119.848V19.648H111.598V27.7Z" fill="#3C4151"/>
                  <path d="M91.409 37.237V34.333H88.439V30.637H92.069V33.541H100.352V28.459H91.409V25.522H88.439V15.952H92.069V24.73H100.352V15.952H103.982V34.333H101.012V37.237H91.409Z" fill="#3C4151"/>
                  <path d="M62.98 31.396V15.952H72.55V18.922H74.86V15.952H81.493V18.922H84.43V31.396H80.833V19.648H75.52V31.396H71.923V19.648H66.61V31.396H62.98Z" fill="#3C4151"/>
                </svg>
              </div>
            </mj-raw>
          </mj-column>
        </mj-section>

        <mj-section padding-top="10px">
          <mj-column>
            <mj-text align="center" font-size="20px" font-weight="bold" color="#333333">
              Restablece tu contraseña
            </mj-text>
            <mj-text align="center" font-size="16px" color="#555555">
              Usa el siguiente enlace para restablecer tu contraseña:
            </mj-text>
            <mj-text align="center" font-size="14px" font-weight="bold" color="#" padding="20px 0">
              <mj-raw>
                <a href="${url}" style="color: #4872E5;" target="_blank" rel="noopener noreferrer">Haz clic en este enlace</a>
              </mj-raw>
            </mj-text>
            <mj-text align="center" font-size="14px" color="#888888">
              Este enlace es válido por una hora. Si no lo solicitaste, puedes ignorar este correo.
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `);

  return htmlTemplate.html;
};
