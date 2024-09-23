import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import html2canvas from 'html2canvas';
import 'instantsearch.css/themes/satellite.css';
import React, { useEffect, useRef, useState } from 'react';
import { InstantSearch, SearchBox } from 'react-instantsearch';
import { LogoIcon } from '../assets/icons/logo';
import { useStorage } from '../lib/shared';
import { draggableButtonPositionStorage, type Position } from '../lib/storage';
import { saveBookmark } from '../services';
import { uploadFile } from '../services/media';
import ContextMenuRight from './ContextMenuRight';
import CustomInfiniteHits from './CustomInfiniteHits';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
const { searchClient } = instantMeiliSearch(
  'http://localhost:7700',
  '6c57f1f5582cebf209fd4ac1b9f401d000ac52ba0d533b32eb409658ba0e7be1'
);

type Props = {
  handleClick: () => void;
};
interface MenuPosition {
  x: number;
  y: number;
}
const DraggableButton: React.FC<Props> = ({ handleClick }) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const draggableButtonPosition = useStorage(draggableButtonPositionStorage);
  // Khởi tạo vị trí từ localStorage hoặc mặc định

  const [position, setPosition] = useState<Position>(draggableButtonPosition);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [offset, setOffset] = useState<Position>({ x: 0, y: 0 });

  // State để quản lý Menu
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition>({
    x: 0,
    y: 0,
  });

  // Handler cho sự kiện MouseDown trong React
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    // Tắt transition khi bắt đầu kéo
    if (buttonRef.current) {
      buttonRef.current.style.transition = 'none';
    }
  };

  // Handler cho sự kiện TouchStart trong React
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setOffset({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    });
    if (buttonRef.current) {
      buttonRef.current.style.transition = 'none';
    }
  };

  // Handler cho sự kiện MouseMove trên document (DOM's MouseEvent)
  const handleDocumentMouseMove = (e: MouseEvent) => {
    if (isDragging && buttonRef.current) {
      let newX = e.clientX - offset.x;
      let newY = e.clientY - offset.y;

      // Giới hạn vị trí trong cửa sổ trình duyệt
      const maxX = window.innerWidth - buttonRef.current.offsetWidth;
      const maxY = window.innerHeight - buttonRef.current.offsetHeight;

      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));

      setPosition({ x: newX, y: newY });
    }
  };

  // Handler cho sự kiện MouseUp trên document (DOM's MouseEvent)
  const handleDocumentMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      if (buttonRef.current) {
        buttonRef.current.style.transition = 'background-color 0.3s';
      }
    }
  };

  // Handler cho sự kiện TouchMove trên document (DOM's TouchEvent)
  const handleDocumentTouchMove = (e: TouchEvent) => {
    if (isDragging && buttonRef.current) {
      const touch = e.touches[0];
      let newX = touch.clientX - offset.x;
      let newY = touch.clientY - offset.y;

      const maxX = window.innerWidth - buttonRef.current.offsetWidth;
      const maxY = window.innerHeight - buttonRef.current.offsetHeight;

      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));

      setPosition({ x: newX, y: newY });
      e.preventDefault();
    }
  };

  // Handler cho sự kiện TouchEnd trên document (DOM's TouchEvent)
  const handleDocumentTouchEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      if (buttonRef.current) {
        buttonRef.current.style.transition = 'background-color 0.3s';
      }
    }
  };

  // Handler cho sự kiện bàn phím
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  };
  // Handler cho sự kiện Context Menu (chuột phải)
  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsMenuVisible(true);
    setMenuPosition({ x: e.clientX, y: e.clientY });
  };

  // Handler để đóng menu khi nhấp ra ngoài
  const handleClickOutside = (e: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(e.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(e.target as Node)
    ) {
      setIsMenuVisible(false);
    }
  };

  // Handler để đóng menu khi nhấn phím Escape
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsMenuVisible(false);
    }
  };
  useEffect(() => {
    // Thêm event listeners khi component được mount
    document.addEventListener('mousemove', handleDocumentMouseMove);
    document.addEventListener('mouseup', handleDocumentMouseUp);
    document.addEventListener('touchmove', handleDocumentTouchMove, {
      passive: false,
    });
    document.addEventListener('touchend', handleDocumentTouchEnd);
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    // Loại bỏ event listeners khi component bị unmount
    return () => {
      document.removeEventListener('mousemove', handleDocumentMouseMove);
      document.removeEventListener('mouseup', handleDocumentMouseUp);
      document.removeEventListener('touchmove', handleDocumentTouchMove);
      document.removeEventListener('touchend', handleDocumentTouchEnd);
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [
    handleDocumentMouseMove,
    handleDocumentMouseUp,
    handleDocumentTouchEnd,
    handleDocumentTouchMove,
    isDragging,
    offset,
  ]);
  // Lưu vị trí vào localStorage khi position thay đổi
  useEffect(() => {
    draggableButtonPositionStorage.setData(position);
  }, [position]);
  // Handler khi nhấp vào một tùy chọn trong menu
  const handleMenuItemClick = async (action: string) => {
    setIsMenuVisible(false);
    if (action === 'Add bookmark') {
      const image = await captureScreenshot();
      const page = getWebInfo();
      let image2 = '';
      if (image) {
        const media = await uploadFile(image);
        image2 = media[0].url ? media[0].url : page.image;
      }

      page.image = image2;
      console.log(page);

      await saveBookmark(page);
    } else if (action === 'Search') {
      setOpenDialog(true);
    }
  };
  const getWebInfo = () => {
    const title = document.title;
    const url = window.location.href;

    // Lấy description từ thẻ meta
    const description =
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute('content') || 'No description available';

    // Lấy image từ thẻ meta (ví dụ: Open Graph image)
    const image =
      document
        .querySelector('meta[property="og:image"]')
        ?.getAttribute('content') || 'No image available';
    return {
      title,
      description,
      image,
      url,
    };
  };

  const captureScreenshot = () => {
    const element = document.body;
    const pathname = window.location.pathname
      .substring(1) // Xóa dấu '/' ở đầu
      .replace(/\/$/, '') // Xóa dấu '/' ở cuối
      .replace(/\//g, ''); // Xóa tất cả dấu '/' còn lại

    return html2canvas(element, {
      useCORS: true,
      allowTaint: false,
      logging: true,
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        return fetch(imgData)
          .then((res) => res.blob())
          .then(async (blob) => {
            const file = new File([blob], `${pathname}.png`, {
              type: 'image/png',
            });
            return file;
          })
          .then((response) => {
            return response;
          })
          .catch((error) => {
            console.error('Lỗi khi tải lên file:', error);
          });
      })
      .catch((error) => {
        console.error('Lỗi khi chụp màn hình:', error);
      });
  };
  function handCLick(hit: any) {
    console.log(hit);
  }
  return (
    <>
      <div
        ref={buttonRef}
        className={`ptn1411-draggable-button ${isDragging ? 'dragging' : ''}`}
        style={{ left: position.x, top: position.y }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onContextMenu={handleContextMenu} // Xử lý sự kiện chuột phải
        role="button"
        tabIndex={0}
        aria-label="Draggable button"
      >
        <span>
          <LogoIcon />
        </span>
      </div>

      {isMenuVisible && (
        <ContextMenuRight
          ref={menuRef} // Truyền ref vào ContextMenu
          position={menuPosition}
          onClose={() => setIsMenuVisible(false)}
          onSelect={handleMenuItemClick}
        />
      )}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[900px] h-3/4 bg-white">
          <DialogHeader>
            <DialogTitle>Search</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <InstantSearch indexName="bookmarks" searchClient={searchClient}>
            <SearchBox placeholder="Search" autoFocus />
            <ScrollArea className="h-[99.333333%] rounded-md border">
              <CustomInfiniteHits handClick={handCLick} />
            </ScrollArea>
          </InstantSearch>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DraggableButton;
