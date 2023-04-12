export default function Card() {
  return (
    <a
      className="rounded-xl border border-gray-100 p-4 shadow-xl sm:p-6 lg:p-8"
      href=""
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10 text-blue-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M12 14l9-5-9-5-9 5 9 5z" />
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
        />
      </svg>

      <h3 className="mt-3 text-lg font-bold text-white sm:text-xl">
        Lorem, ipsum dolor.
      </h3>

      <p className="mt-4 text-sm text-gray-300">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odio eius
        labore nisi tempore modi vel voluptate ullam nostrum adipisci suscipit
        eaque quae cupiditate, accusamus minus laboriosam totam laborum,
        deserunt sint.
      </p>
    </a>
  );
}
