import React, { useEffect } from 'react';
import ReactTooltip from 'react-tooltip';

interface SleatorsArticleProps {}

const SleatorsArticle: React.FC<SleatorsArticleProps> = ({}) => {
  useEffect(() => {
    ReactTooltip.rebuild();
  });

  return (
    <>
      <p>Sleators algorithm was created in 1979</p>
      <h4>Preparation</h4>
      <p>
        Since this is an{' '}
        <span data-tip="Means the entire input is known beforehand" className="underline decoration-dotted decoration-gray-500 decoration-1 ">
          offline
        </span>{' '}
        algorithm, we know the entire input beforehand.
      </p>
      <div className="flex flex-col items-center p-5 bg-gray-700 rounded-lg not-prose">
        <svg width="784" height="158" viewBox="0 0 784 158" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0.5" y="126.5" width="203" height="31" fill="#FBBF24" stroke="black" />
          <rect x="214.167" y="59.5" width="77" height="98" fill="#FBBF24" stroke="black" />
          <rect x="301.833" y="30.5" width="77" height="127" fill="#FBBF24" stroke="black" />
          <rect x="389.5" y="109.5" width="77" height="48" fill="#FBBF24" stroke="black" />
          <rect x="477.167" y="0.5" width="156" height="157" fill="#FBBF24" stroke="black" />
          <rect x="643.833" y="139.5" width="104" height="18" fill="#FBBF24" stroke="black" />
          <rect x="758.5" y="69.5" width="25" height="88" fill="#FBBF24" stroke="black" />
        </svg>

        <p className="mt-5 text-sm text-white">Unsorted input</p>
      </div>
      <p>The items with a width greater than half of the strip needs to seperated out.</p>
      <div className="flex flex-col items-center p-5 mt-5 bg-gray-700 rounded-lg not-prose">
        <svg width="784" height="158" viewBox="0 0 784 158" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0.5" y="126.5" width="203" height="31" fill="#FBBF24" stroke="black" />
        </svg>

        <p className="mt-5 text-sm text-white">Items with width greater than half of the strip</p>
      </div>
      <p>After we sort the remaining items by non-increasing height.</p>
      <div className="flex flex-col items-center p-5 mt-5 bg-gray-700 rounded-lg not-prose">
        <svg width="784" height="158" viewBox="0 0 784 158" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="157" height="158" fill="#FBBF24" stroke="black" />
          <rect x="166.5" y="30" width="78" height="128" fill="#FBBF24" stroke="black" />
          <rect x="254" y="59" width="78" height="99" fill="#FBBF24" stroke="black" />
          <rect x="341.5" y="69" width="26" height="89" fill="#FBBF24" stroke="black" />
          <rect x="377" y="109" width="78" height="49" fill="#FBBF24" stroke="black" />

          <rect x={679 - 205 - 10} y="139" width="105" height="19" fill="#FBBF24" stroke="black" />
        </svg>

        <p className="mt-5 text-sm text-white">Sorted input</p>
      </div>
      <h4>Execution</h4>
      <p>The items with a width greater than half of the strip is placed on top of each other in random order at the bottom.</p>
      <p>After that a row is placed with many that fits.</p>
      <p>
        On top of the row we split the strip in two equal sized new strips. We start by taking the lower of the sides and place an item there. We
        continue until there is no more space on the row.
      </p>
      <p>We continue to always taking the lower of the two sides and places a row there, until we run out of items.</p>
      <p>This is visualized below with the numbers indicating the order of placement in the strip.</p>
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center self-center p-5 mt-5 bg-gray-700 rounded-lg not-prose max-w-min">
          <svg height="322" width="369" fill="none" viewBox="0 0 369 322" xmlns="http://www.w3.org/2000/svg">
            <rect height="321" width="349" fill="white" x="1" y="1" />
            <rect height="157" width="156" fill="#FBBF24" stroke="black" x="1.5" y="131.5" />
            <rect height="127" width="77" fill="#FBBF24" stroke="black" x="158.5" y="161.5" />
            <rect height="98" width="77" fill="#FBBF24" stroke="black" x="236.5" y="191.5" />
            <rect height="88" width="25" fill="#FBBF24" stroke="black" x="314.5" y="200.5" />
            <rect height="48" width="77" fill="#FBBF24" stroke="black" x="176.5" y="111.5" />
            <rect height="29" width="114" fill="#FBBF24" opacity="0.5" stroke="black" x="254.5" y="130.5" />
            <rect height="29" width="114" fill="#FBBF24" stroke="black" x="1.5" y="100.5" />
            <rect height="31" width="204" fill="#FBBF24" stroke="black" x="1.5" y="290.5" />
            <rect height="18" width="104" fill="#FBBF24" stroke="black" x="176.5" y="91.5" />
            <line stroke="black" strokeDasharray="4 4" strokeWidth="2" x1="176" x2="350" y1="160" y2="160" />
            <line stroke="black" strokeDasharray="4 4" strokeWidth="2" x1="0.994286" x2="175.994" y1="131" y2="130" />
            <line stroke="black" strokeDasharray="4 4" strokeWidth="2" x1="176" x2="350" y1="111" y2="111" />
            <line stroke="black" strokeDasharray="4 4" strokeWidth="2" x1="174" x2="175" y1="160.994" y2="0.993744" />
            <line stroke="black" strokeDasharray="4 4" strokeWidth="2" x1="1" x2="350" y1="289" y2="289" />
            <path d="M108.695 299.562V311H107.25V301.367L104.336 302.43V301.125L108.469 299.562H108.695Z" fill="black" />
            <path
              d="M87.3984 213.812V215H79.9531V213.961L83.6797 209.812C84.138 209.302 84.4922 208.87 84.7422 208.516C84.9974 208.156 85.1745 207.836 85.2734 207.555C85.3776 207.268 85.4297 206.977 85.4297 206.68C85.4297 206.305 85.3516 205.966 85.1953 205.664C85.0443 205.357 84.8203 205.112 84.5234 204.93C84.2266 204.747 83.8672 204.656 83.4453 204.656C82.9401 204.656 82.5182 204.755 82.1797 204.953C81.8464 205.146 81.5964 205.417 81.4297 205.766C81.263 206.115 81.1797 206.516 81.1797 206.969H79.7344C79.7344 206.328 79.875 205.742 80.1562 205.211C80.4375 204.68 80.8542 204.258 81.4062 203.945C81.9583 203.628 82.638 203.469 83.4453 203.469C84.1641 203.469 84.7786 203.596 85.2891 203.852C85.7995 204.102 86.1901 204.456 86.4609 204.914C86.737 205.367 86.875 205.898 86.875 206.508C86.875 206.841 86.8177 207.18 86.7031 207.523C86.5938 207.862 86.4401 208.201 86.2422 208.539C86.0495 208.878 85.8229 209.211 85.5625 209.539C85.3073 209.867 85.0339 210.19 84.7422 210.508L81.6953 213.812H87.3984Z"
              fill="black"
            />
            <path
              d="M196.055 224.602H197.086C197.591 224.602 198.008 224.518 198.336 224.352C198.669 224.18 198.917 223.948 199.078 223.656C199.245 223.359 199.328 223.026 199.328 222.656C199.328 222.219 199.255 221.852 199.109 221.555C198.964 221.258 198.745 221.034 198.453 220.883C198.161 220.732 197.792 220.656 197.344 220.656C196.938 220.656 196.578 220.737 196.266 220.898C195.958 221.055 195.716 221.279 195.539 221.57C195.367 221.862 195.281 222.206 195.281 222.602H193.836C193.836 222.023 193.982 221.497 194.273 221.023C194.565 220.549 194.974 220.172 195.5 219.891C196.031 219.609 196.646 219.469 197.344 219.469C198.031 219.469 198.633 219.591 199.148 219.836C199.664 220.076 200.065 220.435 200.352 220.914C200.638 221.388 200.781 221.979 200.781 222.688C200.781 222.974 200.714 223.281 200.578 223.609C200.448 223.932 200.242 224.234 199.961 224.516C199.685 224.797 199.326 225.029 198.883 225.211C198.44 225.388 197.909 225.477 197.289 225.477H196.055V224.602ZM196.055 225.789V224.922H197.289C198.013 224.922 198.612 225.008 199.086 225.18C199.56 225.352 199.932 225.581 200.203 225.867C200.479 226.154 200.672 226.469 200.781 226.812C200.896 227.151 200.953 227.49 200.953 227.828C200.953 228.359 200.862 228.831 200.68 229.242C200.503 229.654 200.25 230.003 199.922 230.289C199.599 230.576 199.219 230.792 198.781 230.938C198.344 231.083 197.867 231.156 197.352 231.156C196.857 231.156 196.391 231.086 195.953 230.945C195.521 230.805 195.138 230.602 194.805 230.336C194.471 230.065 194.211 229.734 194.023 229.344C193.836 228.948 193.742 228.497 193.742 227.992H195.188C195.188 228.388 195.273 228.734 195.445 229.031C195.622 229.328 195.872 229.56 196.195 229.727C196.523 229.888 196.909 229.969 197.352 229.969C197.794 229.969 198.174 229.893 198.492 229.742C198.815 229.586 199.062 229.352 199.234 229.039C199.411 228.727 199.5 228.333 199.5 227.859C199.5 227.385 199.401 226.997 199.203 226.695C199.005 226.388 198.724 226.161 198.359 226.016C198 225.865 197.576 225.789 197.086 225.789H196.055Z"
              fill="black"
            />
            <path
              d="M279.633 241.172V242.359H271.414V241.508L276.508 233.625H277.688L276.422 235.906L273.055 241.172H279.633ZM278.047 233.625V245H276.602V233.625H278.047Z"
              fill="black"
            />
            <path
              d="M325.773 244.586L324.617 244.289L325.188 238.625H331.023V239.961H326.414L326.07 243.055C326.279 242.935 326.542 242.823 326.859 242.719C327.182 242.615 327.552 242.562 327.969 242.562C328.495 242.562 328.966 242.654 329.383 242.836C329.799 243.013 330.154 243.268 330.445 243.602C330.742 243.935 330.969 244.336 331.125 244.805C331.281 245.273 331.359 245.797 331.359 246.375C331.359 246.922 331.284 247.424 331.133 247.883C330.987 248.341 330.766 248.742 330.469 249.086C330.172 249.424 329.797 249.688 329.344 249.875C328.896 250.062 328.367 250.156 327.758 250.156C327.299 250.156 326.865 250.094 326.453 249.969C326.047 249.839 325.682 249.643 325.359 249.383C325.042 249.117 324.781 248.789 324.578 248.398C324.38 248.003 324.255 247.539 324.203 247.008H325.578C325.641 247.435 325.766 247.794 325.953 248.086C326.141 248.378 326.385 248.599 326.688 248.75C326.995 248.896 327.352 248.969 327.758 248.969C328.102 248.969 328.406 248.909 328.672 248.789C328.938 248.669 329.161 248.497 329.344 248.273C329.526 248.049 329.664 247.779 329.758 247.461C329.857 247.143 329.906 246.786 329.906 246.391C329.906 246.031 329.857 245.698 329.758 245.391C329.659 245.083 329.51 244.815 329.312 244.586C329.12 244.357 328.883 244.18 328.602 244.055C328.32 243.924 327.997 243.859 327.633 243.859C327.148 243.859 326.781 243.924 326.531 244.055C326.286 244.185 326.034 244.362 325.773 244.586Z"
              fill="black"
            />
            <path d="M315.297 139.625V140.438L310.586 151H309.062L313.766 140.812H307.609V139.625H315.297Z" fill="black" opacity="0.5" />
            <path
              d="M217.492 130.609H217.617V131.836H217.492C216.727 131.836 216.086 131.961 215.57 132.211C215.055 132.456 214.646 132.786 214.344 133.203C214.042 133.615 213.823 134.078 213.688 134.594C213.557 135.109 213.492 135.633 213.492 136.164V137.836C213.492 138.341 213.552 138.789 213.672 139.18C213.792 139.565 213.956 139.891 214.164 140.156C214.372 140.422 214.607 140.622 214.867 140.758C215.133 140.893 215.409 140.961 215.695 140.961C216.029 140.961 216.326 140.898 216.586 140.773C216.846 140.643 217.065 140.464 217.242 140.234C217.424 140 217.562 139.724 217.656 139.406C217.75 139.089 217.797 138.74 217.797 138.359C217.797 138.021 217.755 137.695 217.672 137.383C217.589 137.065 217.461 136.784 217.289 136.539C217.117 136.289 216.901 136.094 216.641 135.953C216.385 135.807 216.081 135.734 215.727 135.734C215.326 135.734 214.951 135.833 214.602 136.031C214.258 136.224 213.974 136.479 213.75 136.797C213.531 137.109 213.406 137.451 213.375 137.82L212.609 137.812C212.682 137.229 212.818 136.732 213.016 136.32C213.219 135.904 213.469 135.565 213.766 135.305C214.068 135.039 214.404 134.846 214.773 134.727C215.148 134.602 215.544 134.539 215.961 134.539C216.529 134.539 217.018 134.646 217.43 134.859C217.841 135.073 218.18 135.359 218.445 135.719C218.711 136.073 218.906 136.474 219.031 136.922C219.161 137.365 219.227 137.82 219.227 138.289C219.227 138.826 219.151 139.328 219 139.797C218.849 140.266 218.622 140.677 218.32 141.031C218.023 141.385 217.656 141.661 217.219 141.859C216.781 142.057 216.273 142.156 215.695 142.156C215.081 142.156 214.544 142.031 214.086 141.781C213.628 141.526 213.247 141.188 212.945 140.766C212.643 140.344 212.417 139.875 212.266 139.359C212.115 138.844 212.039 138.32 212.039 137.789V137.109C212.039 136.307 212.12 135.521 212.281 134.75C212.443 133.979 212.721 133.281 213.117 132.656C213.518 132.031 214.073 131.534 214.781 131.164C215.49 130.794 216.393 130.609 217.492 130.609Z"
              fill="black"
            />
            <path
              d="M232.117 101.922C232.117 102.615 231.956 103.203 231.633 103.688C231.315 104.167 230.883 104.531 230.336 104.781C229.794 105.031 229.182 105.156 228.5 105.156C227.818 105.156 227.203 105.031 226.656 104.781C226.109 104.531 225.677 104.167 225.359 103.688C225.042 103.203 224.883 102.615 224.883 101.922C224.883 101.469 224.969 101.055 225.141 100.68C225.318 100.299 225.565 99.9688 225.883 99.6875C226.206 99.4062 226.586 99.1901 227.023 99.0391C227.466 98.8828 227.953 98.8047 228.484 98.8047C229.182 98.8047 229.805 98.9401 230.352 99.2109C230.898 99.4766 231.328 99.8438 231.641 100.312C231.958 100.781 232.117 101.318 232.117 101.922ZM230.664 101.891C230.664 101.469 230.573 101.096 230.391 100.773C230.208 100.445 229.953 100.19 229.625 100.008C229.297 99.8255 228.917 99.7344 228.484 99.7344C228.042 99.7344 227.659 99.8255 227.336 100.008C227.018 100.19 226.771 100.445 226.594 100.773C226.417 101.096 226.328 101.469 226.328 101.891C226.328 102.328 226.414 102.703 226.586 103.016C226.763 103.323 227.013 103.56 227.336 103.727C227.664 103.888 228.052 103.969 228.5 103.969C228.948 103.969 229.333 103.888 229.656 103.727C229.979 103.56 230.227 103.323 230.398 103.016C230.576 102.703 230.664 102.328 230.664 101.891ZM231.852 96.5859C231.852 97.138 231.706 97.6354 231.414 98.0781C231.122 98.5208 230.724 98.8698 230.219 99.125C229.714 99.3802 229.141 99.5078 228.5 99.5078C227.849 99.5078 227.268 99.3802 226.758 99.125C226.253 98.8698 225.857 98.5208 225.57 98.0781C225.284 97.6354 225.141 97.138 225.141 96.5859C225.141 95.9245 225.284 95.362 225.57 94.8984C225.862 94.4349 226.26 94.0807 226.766 93.8359C227.271 93.5911 227.846 93.4688 228.492 93.4688C229.143 93.4688 229.721 93.5911 230.227 93.8359C230.732 94.0807 231.128 94.4349 231.414 94.8984C231.706 95.362 231.852 95.9245 231.852 96.5859ZM230.406 96.6094C230.406 96.2292 230.326 95.8932 230.164 95.6016C230.003 95.3099 229.779 95.0807 229.492 94.9141C229.206 94.7422 228.872 94.6562 228.492 94.6562C228.112 94.6562 227.779 94.737 227.492 94.8984C227.211 95.0547 226.99 95.2786 226.828 95.5703C226.672 95.862 226.594 96.2083 226.594 96.6094C226.594 97 226.672 97.3411 226.828 97.6328C226.99 97.9245 227.214 98.151 227.5 98.3125C227.786 98.474 228.12 98.5547 228.5 98.5547C228.88 98.5547 229.211 98.474 229.492 98.3125C229.779 98.151 230.003 97.9245 230.164 97.6328C230.326 97.3411 230.406 97 230.406 96.6094Z"
              fill="black"
            />
            <path d="M62.2969 108.625V109.438L57.5859 120H56.0625L60.7656 109.812H54.6094V108.625H62.2969Z" fill="black" />
          </svg>
          <p className="mt-5 text-sm text-white">Example of Sleators algorithm packing</p>
        </div>
      </div>
    </>
  );
};

export default SleatorsArticle;
