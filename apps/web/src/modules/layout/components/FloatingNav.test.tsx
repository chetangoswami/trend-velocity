import '@testing-library/jest-dom'
import { render, screen, act, fireEvent } from '@testing-library/react'
import { FloatingNav } from './FloatingNav'

// Mock timers for hide delay testing
jest.useFakeTimers()

describe('FloatingNav', () => {
    afterEach(() => {
        jest.clearAllTimers()
    })

    describe('Rendering', () => {
        it('should render navigation element', () => {
            render(<FloatingNav />)

            expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument()
        })

        it('should render menu, search, and cart buttons', () => {
            render(<FloatingNav />)

            expect(screen.getByRole('button', { name: 'Menu' })).toBeInTheDocument()
            expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument()
            expect(screen.getByRole('button', { name: 'Shopping cart' })).toBeInTheDocument()
        })

        it('should be visible initially', () => {
            render(<FloatingNav />)

            const nav = screen.getByRole('navigation')
            expect(nav).toHaveClass('opacity-100')
        })
    })

    describe('Auto-hide behavior (AC: 5.2)', () => {
        it('should hide after default 3000ms of inactivity', () => {
            render(<FloatingNav />)

            const nav = screen.getByRole('navigation')
            expect(nav).toHaveClass('opacity-100')

            // Fast-forward past hide delay
            act(() => {
                jest.advanceTimersByTime(3000)
            })

            expect(nav).toHaveClass('opacity-0')
        })

        it('should hide after custom hideDelay', () => {
            render(<FloatingNav hideDelay={1000} />)

            const nav = screen.getByRole('navigation')

            act(() => {
                jest.advanceTimersByTime(1000)
            })

            expect(nav).toHaveClass('opacity-0')
        })

        it('should set aria-hidden when hidden', () => {
            render(<FloatingNav hideDelay={1000} />)

            const nav = screen.getByRole('navigation')

            expect(nav).toHaveAttribute('aria-hidden', 'false')

            act(() => {
                jest.advanceTimersByTime(1000)
            })

            expect(nav).toHaveAttribute('aria-hidden', 'true')
        })

        it('should set tabIndex -1 on buttons when hidden', () => {
            render(<FloatingNav hideDelay={1000} />)

            // Get button reference BEFORE hiding (aria-hidden=true affects getByRole)
            const menuButton = screen.getByRole('button', { name: 'Menu' })
            expect(menuButton).toHaveAttribute('tabIndex', '0')

            act(() => {
                jest.advanceTimersByTime(1000)
            })

            // Now check tabIndex changed
            expect(menuButton).toHaveAttribute('tabIndex', '-1')
        })

        it('should show nav again when user interacts after hiding', () => {
            render(<FloatingNav hideDelay={1000} />)

            const nav = screen.getByRole('navigation')

            // First hide the nav
            act(() => {
                jest.advanceTimersByTime(1000)
            })
            expect(nav).toHaveClass('opacity-0')

            // Simulate user interaction
            act(() => {
                fireEvent.mouseMove(window)
            })

            // Nav should be visible again
            expect(nav).toHaveClass('opacity-100')
        })
    })

    describe('Touch Target Size (AC: 2)', () => {
        it('should have touch-target class on all buttons', () => {
            render(<FloatingNav />)

            const buttons = screen.getAllByRole('button')
            buttons.forEach(button => {
                expect(button).toHaveClass('touch-target')
            })
        })
    })

    describe('Visual Styling (AC: 5.3)', () => {
        it('should have backdrop blur for glassmorphism effect', () => {
            render(<FloatingNav />)

            const menuButton = screen.getByRole('button', { name: 'Menu' })
            expect(menuButton).toHaveClass('backdrop-blur-md')
        })
    })
})
