import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { LayoutWrapper } from './LayoutWrapper'

describe('LayoutWrapper', () => {
    describe('Rendering', () => {
        it('should render children', () => {
            render(
                <LayoutWrapper>
                    <div data-testid="child">Test Content</div>
                </LayoutWrapper>
            )

            expect(screen.getByTestId('child')).toBeInTheDocument()
        })

        it('should render main content area', () => {
            render(
                <LayoutWrapper>
                    <div>Content</div>
                </LayoutWrapper>
            )

            expect(screen.getByRole('main')).toBeInTheDocument()
        })

        it('should render context sidebar (desktop)', () => {
            render(
                <LayoutWrapper>
                    <div>Content</div>
                </LayoutWrapper>
            )

            expect(screen.getByRole('complementary', { name: 'Product context' })).toBeInTheDocument()
        })
    })

    describe('Responsive Layout (AC: 4)', () => {
        it('should have full height viewport', () => {
            render(
                <LayoutWrapper>
                    <div>Content</div>
                </LayoutWrapper>
            )

            // Check for h-dvh class on main
            const main = screen.getByRole('main')
            expect(main).toHaveClass('h-dvh')
        })

        it('should have lg:grid for desktop layout', () => {
            render(
                <LayoutWrapper>
                    <div>Content</div>
                </LayoutWrapper>
            )

            // The parent div should have lg:grid
            const main = screen.getByRole('main')
            const gridContainer = main.parentElement
            expect(gridContainer).toHaveClass('lg:grid')
        })

        it('should have tablet padding classes', () => {
            render(
                <LayoutWrapper>
                    <div>Content</div>
                </LayoutWrapper>
            )

            const main = screen.getByRole('main')
            expect(main).toHaveClass('md:px-4')
            expect(main).toHaveClass('lg:px-0')
        })
    })

    describe('Desktop Gutters (AC: 4.2)', () => {
        it('should have hidden left gutter on mobile', () => {
            render(
                <LayoutWrapper>
                    <div>Content</div>
                </LayoutWrapper>
            )

            // Left gutter should have aria-hidden
            const leftGutter = document.querySelector('[aria-hidden="true"]')
            expect(leftGutter).toBeInTheDocument()
            expect(leftGutter).toHaveClass('hidden', 'lg:block')
        })
    })

    describe('Sidebar (AC: 4.3)', () => {
        it('should have sidebar hidden on mobile', () => {
            render(
                <LayoutWrapper>
                    <div>Content</div>
                </LayoutWrapper>
            )

            const sidebar = screen.getByRole('complementary')
            expect(sidebar).toHaveClass('hidden', 'lg:flex')
        })

        it('should provide portal target for sidebar', () => {
            render(
                <LayoutWrapper>
                    <div>Content</div>
                </LayoutWrapper>
            )

            const sidebar = screen.getByRole('complementary')
            expect(sidebar).toHaveAttribute('id', 'context-sidebar-portal')
        })
    })
})
