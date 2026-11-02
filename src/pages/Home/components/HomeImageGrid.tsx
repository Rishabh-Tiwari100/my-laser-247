import { cn } from '@/utils';
import HomeImageContainer from './HomeImageContainer';

type Props = { image: string; type: string; link: string; name: string; enableFooter: boolean };
const HomeImageGrid = ({ images, className = '' }: { images: Props[]; className?: string }) => {
  return (
    <div className={cn('mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-2.5', className)}>
      {images.map((image) => (
        <HomeImageContainer
          key={image.image}
          name={image.name}
          image={image.image}
          type={image.type}
          link={image.link}
          enableFooter={image.enableFooter}
        />
      ))}
    </div>
  );
};

export default HomeImageGrid;
