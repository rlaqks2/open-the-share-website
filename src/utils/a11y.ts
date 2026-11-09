/**
 * @file a11y.ts
 * @description div/article 같은 비-버튼 요소를 클릭 가능하게 만들 때,
 * 키보드(Enter/Space) 사용자와 스크린리더도 동일하게 쓸 수 있도록 속성을 묶어 제공합니다.
 *
 * 사용 예) <article {...clickableProps(() => open(item))} className="...">
 */
import type { KeyboardEvent } from 'react';

export function clickableProps(onActivate: () => void, label?: string) {
    return {
        role: 'button' as const,
        tabIndex: 0,
        'aria-label': label,
        onClick: onActivate,
        onKeyDown: (e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onActivate();
            }
        },
    };
}
