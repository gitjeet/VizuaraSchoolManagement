import React, { ReactNode, useState } from 'react';

interface CarouselItem {
  src: string;
  type?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  children?: ReactNode;
}

const Carousel: React.FC<CarouselProps> = ({ items, children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>(items);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleAddItem = (item: CarouselItem) => {
    setCarouselItems((prevItems) => [...prevItems, item]);
  };

  const handleRemoveItem = (index: number) => {
    setCarouselItems((prevItems) =>
      prevItems.filter((_, i) => i !== index)
    );
  };

  const renderItem = (item: CarouselItem, index: number) => {
    if (typeof item === 'string') {
      return <img src={item} alt={`Carousel Item ${index}`} key={index} />;
    } else if (typeof item === 'object' && item.type) {
      return (
        <video key={index} controls>
          <source src={item.src} type={item.type} />
        </video>
      );
    }
    return null;
  };

  return (
    <div>
      <div>
        {carouselItems?.map((item, index) => (
          <div key={index} style={{ display: index === currentIndex ? 'block' : 'none' }}>
            {renderItem(item, index)}
            <button onClick={() => handleRemoveItem(index)}>Remove</button>
          </div>
        ))}
      </div>
      <button onClick={handlePrevious}>Previous</button>
      <button onClick={handleNext}>Next</button>
      <div>
        {children}
      </div>
    </div>
  );
};

export default Carousel;