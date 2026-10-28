import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DynamicScrollSection } from '../DynamicScrollSection';
import { AUTHORIZED_PROFILE } from '../../../data/profile';
import * as analytics from '../../../lib/analytics';
import { containsEmoji } from '../../../lib/utils';

describe('DynamicScrollSection Component (Full-Screen 3D Snap Scroll)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders Yuvod production engineering, HP CodeWars, and verified credentials with zero emojis in ES and EN', () => {
    const { rerender } = render(<DynamicScrollSection language="es" />);

    expect(screen.getByTestId('dynamic-scroll-section')).toHaveClass('snap-start', 'h-[100dvh]');
    expect(screen.getByText('Software Engineer & Systems Administrator')).toBeInTheDocument();
    expect(screen.getByText(/Zabbix/i)).toBeInTheDocument();
    expect(screen.getByText(/HP CodeWars/i)).toBeInTheDocument();
    expect(screen.getByText(/DAW \(CEEDCV\) & SMR \(IES El Grao\)/i)).toBeInTheDocument();
    expect(screen.getByText(/AWS & Cisco CCNA 1/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
      'href',
      AUTHORIZED_PROFILE.githubUrl
    );

    expect(containsEmoji(document.body.textContent || '')).toBe(false);

    // English
    rerender(<DynamicScrollSection language="en" />);
    expect(screen.getByText('Software Engineer & Systems Administrator')).toBeInTheDocument();
    expect(screen.getByText(/Zabbix/i)).toBeInTheDocument();
    expect(screen.getByText(/HP CodeWars/i)).toBeInTheDocument();
    expect(containsEmoji(document.body.textContent || '')).toBe(false);
  });

  it('tracks social_click event when clicking the github link', () => {
    const trackSpy = vi.spyOn(analytics, 'trackEvent');
    render(<DynamicScrollSection language="es" />);

    const link = screen.getByRole('link', { name: /github/i });
    fireEvent.click(link);

    expect(trackSpy).toHaveBeenCalledWith('social_click', {
      network: 'github',
      target: 'github',
      url: AUTHORIZED_PROFILE.githubUrl,
    });
  });
});
