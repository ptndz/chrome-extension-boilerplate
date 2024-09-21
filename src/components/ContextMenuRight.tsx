import React, { forwardRef, Ref, useEffect, useRef } from 'react';
import { Label } from './ui/label';
interface ContextMenuProps {
  position: { x: number; y: number };
  onClose: () => void;
  onSelect: (action: string) => void;
}

const ContextMenu = forwardRef<HTMLUListElement, ContextMenuProps>(
  ({ position, onClose, onSelect }, ref: Ref<HTMLUListElement>) => {
    const menuRef = useRef<HTMLUListElement>(null);

    // Merge forwarded ref with local ref
    useEffect(() => {
      if (typeof ref === 'function') {
        ref(menuRef.current);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLUListElement | null>).current =
          menuRef.current;
      }
    }, [ref]);

    // Đóng menu khi nhấn phím Escape
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [onClose]);

    // Đảm bảo menu được focus khi mở
    useEffect(() => {
      const firstMenuItem = menuRef.current?.querySelector(
        '.ptn1411-menu-item'
      ) as HTMLElement;
      firstMenuItem?.focus();
    }, []);

    // Xử lý navigation bằng phím mũi tên
    const handleMenuItemKeyDown = (
      e: React.KeyboardEvent<HTMLLIElement>,
      index: number,
      total: number
    ) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = (index + 1) % total;
        const nextItem = menuRef.current?.children[nextIndex] as HTMLElement;
        nextItem?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = (index - 1 + total) % total;
        const prevItem = menuRef.current?.children[prevIndex] as HTMLElement;
        prevItem?.focus();
      }
    };

    return (
      <ul
        ref={menuRef}
        className="ptn1411-custom-context-menu"
        style={{ top: position.y, left: position.x }}
        role="menu"
        aria-label="Context menu"
      >
        <div className="flex justify-center">
          <Label className="text-xl">Menu</Label>
        </div>

        {['Add bookmark', 'Option 2', 'Option 3'].map((option, index) => (
          <li
            key={option}
            className="ptn1411-menu-item"
            role="menuitem"
            tabIndex={0}
            onClick={() => onSelect(option)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onSelect(option);
              } else {
                handleMenuItemKeyDown(e, index, 3);
              }
            }}
          >
            {option}
          </li>
        ))}
      </ul>
    );
  }
);

// Đặt displayName cho component để đáp ứng quy tắc ESLint
ContextMenu.displayName = 'ContextMenu';

export default ContextMenu;
