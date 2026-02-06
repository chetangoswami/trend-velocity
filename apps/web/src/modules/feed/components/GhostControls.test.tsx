import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { GhostControls } from './GhostControls'

describe('GhostControls', () => {
    const mockOnPrevious = jest.fn()
    const mockOnNext = jest.fn()
    const mockOnDetails = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
    })

    const defaultProps = {
        onPrevious: mockOnPrevious,
        onNext: mockOnNext,
        onDetails: mockOnDetails,
        hasPrevious: true,
        hasNext: true,
        currentProductTitle: 'Diamond Ring'
    }

    describe('Rendering', () => {
        it('should render navigation controls group', () => {
            render(<GhostControls {...defaultProps} />)

            expect(screen.getByRole('group', { name: 'Feed navigation controls' })).toBeInTheDocument()
        })

        it('should render all navigation buttons', () => {
            render(<GhostControls {...defaultProps} />)

            expect(screen.getByRole('button', { name: /previous product/i })).toBeInTheDocument()
            expect(screen.getByRole('button', { name: /next product/i })).toBeInTheDocument()
            expect(screen.getByRole('button', { name: /buy.*now/i })).toBeInTheDocument()
        })

        it('should render screen reader status with current product', () => {
            render(<GhostControls {...defaultProps} />)

            expect(screen.getByRole('status')).toHaveTextContent('Currently viewing: Diamond Ring')
        })
    })

    describe('Button States', () => {
        it('should disable previous button when hasPrevious is false', () => {
            render(<GhostControls {...defaultProps} hasPrevious={false} />)

            const prevButton = screen.getByRole('button', { name: /previous product/i })
            expect(prevButton).toBeDisabled()
            expect(prevButton).toHaveAttribute('aria-disabled', 'true')
        })

        it('should disable next button when hasNext is false', () => {
            render(<GhostControls {...defaultProps} hasNext={false} />)

            const nextButton = screen.getByRole('button', { name: /next product/i })
            expect(nextButton).toBeDisabled()
            expect(nextButton).toHaveAttribute('aria-disabled', 'true')
        })

        it('should show (at beginning) hint in aria-label when no previous', () => {
            render(<GhostControls {...defaultProps} hasPrevious={false} />)

            expect(screen.getByLabelText(/at beginning/i)).toBeInTheDocument()
        })

        it('should show (at end) hint in aria-label when no next', () => {
            render(<GhostControls {...defaultProps} hasNext={false} />)

            expect(screen.getByLabelText(/at end/i)).toBeInTheDocument()
        })
    })

    describe('Click Interactions', () => {
        it('should call onPrevious when previous button clicked', () => {
            render(<GhostControls {...defaultProps} />)

            fireEvent.click(screen.getByRole('button', { name: /previous product/i }))
            expect(mockOnPrevious).toHaveBeenCalledTimes(1)
        })

        it('should call onNext when next button clicked', () => {
            render(<GhostControls {...defaultProps} />)

            fireEvent.click(screen.getByRole('button', { name: /next product/i }))
            expect(mockOnNext).toHaveBeenCalledTimes(1)
        })

        it('should call onDetails when details button clicked', () => {
            render(<GhostControls {...defaultProps} />)

            fireEvent.click(screen.getByRole('button', { name: /buy.*now/i }))
            expect(mockOnDetails).toHaveBeenCalledTimes(1)
        })
    })

    describe('Keyboard Navigation (AC: 3.3)', () => {
        it('should call onPrevious on ArrowUp key', () => {
            render(<GhostControls {...defaultProps} />)

            fireEvent.keyDown(window, { key: 'ArrowUp' })
            expect(mockOnPrevious).toHaveBeenCalledTimes(1)
        })

        it('should call onNext on ArrowDown key', () => {
            render(<GhostControls {...defaultProps} />)

            fireEvent.keyDown(window, { key: 'ArrowDown' })
            expect(mockOnNext).toHaveBeenCalledTimes(1)
        })

        it('should call onPrevious on k key (vim navigation)', () => {
            render(<GhostControls {...defaultProps} />)

            fireEvent.keyDown(window, { key: 'k' })
            expect(mockOnPrevious).toHaveBeenCalledTimes(1)
        })

        it('should call onNext on j key (vim navigation)', () => {
            render(<GhostControls {...defaultProps} />)

            fireEvent.keyDown(window, { key: 'j' })
            expect(mockOnNext).toHaveBeenCalledTimes(1)
        })

        it('should NOT call onPrevious when hasPrevious is false', () => {
            render(<GhostControls {...defaultProps} hasPrevious={false} />)

            fireEvent.keyDown(window, { key: 'ArrowUp' })
            expect(mockOnPrevious).not.toHaveBeenCalled()
        })

        it('should NOT call onNext when hasNext is false', () => {
            render(<GhostControls {...defaultProps} hasNext={false} />)

            fireEvent.keyDown(window, { key: 'ArrowDown' })
            expect(mockOnNext).not.toHaveBeenCalled()
        })
    })

    describe('Accessibility (AC: 3.4)', () => {
        it('should have proper ARIA roles and labels', () => {
            render(<GhostControls {...defaultProps} currentProductTitle="Gold Necklace" />)

            // Group role for navigation controls
            expect(screen.getByRole('group')).toHaveAttribute('aria-label', 'Feed navigation controls')

            // Live region for announcements
            expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
            expect(screen.getByRole('status')).toHaveAttribute('aria-atomic', 'true')

            // Details button includes product name
            expect(screen.getByRole('button', { name: 'Buy Gold Necklace Now' })).toBeInTheDocument()
        })

        it('should have tabIndex -1 on disabled buttons', () => {
            render(<GhostControls {...defaultProps} hasPrevious={false} />)

            const prevButton = screen.getByRole('button', { name: /previous product/i })
            expect(prevButton).toHaveAttribute('tabIndex', '-1')
        })
    })

    describe('Cleanup', () => {
        it('should remove keyboard listener on unmount', () => {
            const { unmount } = render(<GhostControls {...defaultProps} />)

            unmount()

            // After unmount, keyboard events should not trigger callbacks
            fireEvent.keyDown(window, { key: 'ArrowDown' })
            expect(mockOnNext).not.toHaveBeenCalled()
        })
    })
})
