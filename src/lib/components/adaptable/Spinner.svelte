<div class="ls-spinner h-[1em] w-[1em]">
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 128 128"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xml:space="preserve"
    style="fill:var(--_spinner-color, var(--text-color-main));fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"
  >
    <g transform="matrix(0.765961,0,0,0.765961,-526.562,-304.06)">
      <path
        d="M854.563,480.521C854.563,526.636 817.123,564.076 771.008,564.076C724.893,564.076 687.453,526.636 687.453,480.521C687.453,434.406 724.893,396.966 771.008,396.966L771.008,417.855C736.421,417.855 708.342,445.934 708.342,480.521C708.342,515.107 736.421,543.187 771.008,543.187C805.594,543.187 833.674,515.107 833.674,480.521L854.563,480.521Z"
      />
    </g>
  </svg>
</div>

<style>
  .ls-spinner {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
