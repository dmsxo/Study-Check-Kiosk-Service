import classNames from 'classnames';

const toggleColors = {
  '1학년': {
    on: 'bg-blue-400 text-white',
    off: 'bg-blue-50 text-blue-400',
    border: 'border-blue-400'
  },
  '2학년': {
    on: 'bg-orange-400 text-white',
    off: 'bg-orange-50 text-orange-400',
    border: 'border-orange-400'
  },
  '3학년': {
    on: 'bg-emerald-400 text-white',
    off: 'bg-emerald-50 text-emerald-400',
    border: 'border-emerald-400'
  },
  '아침 독서': {
    on: 'bg-amber-400 text-white',
    off: 'bg-amber-50 text-amber-400',
    border: 'border-amber-400'
  },
  '야간 자율': {
    on: 'bg-violet-400 text-white',
    off: 'bg-violet-50 text-violet-400',
    border: 'border-violet-400'
  }
};

function ToggleGroup({ contents, sellectedContent, setSellectedContent }) {
  return contents.map((content) => {
    const isActive = sellectedContent.includes(content);
    return (
      <button
        key={content}
        onClick={() =>
          setSellectedContent((prev) =>
            prev.includes(content) ? prev.filter((g) => g !== content) : [...prev, content]
          )
        }
        className={classNames(
          'flex-1 border rounded-2xl p-2 min-w-fit',
          toggleColors[content].border,
          {
            [toggleColors[content].on]: isActive,
            [toggleColors[content].off]: !isActive
          }
        )}
      >
        {content}
      </button>
    );
  });
}

export default ToggleGroup;
