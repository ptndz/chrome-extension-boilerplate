import { useInfiniteHits, UseInfiniteHitsProps } from 'react-instantsearch';

function CustomInfiniteHits(
  props: UseInfiniteHitsProps & { handClick: (hit: any) => void }
) {
  const { items, showPrevious, showMore, isFirstPage, isLastPage } =
    useInfiniteHits(props);

  return (
    <div>
      <button
        className="ais-InfiniteHits-loadPrevious"
        onClick={showPrevious}
        disabled={isFirstPage}
      >
        Show previous results
      </button>
      <ol className="ais-InfiniteHits-list">
        {items.map((hit) => (
          <li
            className="ais-InfiniteHits-item"
            key={hit.id}
            onClick={() => props.handClick(hit)}
          >
            <article>
              <div className="p-4">
                <div className="text-sm">{hit.title}</div>
                <p>{hit.description}</p>
              </div>
            </article>
          </li>
        ))}
      </ol>
      <button
        className="ais-InfiniteHits-loadMore"
        onClick={showMore}
        disabled={isLastPage}
      >
        Show more results
      </button>
    </div>
  );
}
export default CustomInfiniteHits;
