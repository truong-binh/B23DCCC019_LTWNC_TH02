import { beforeEach, describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PlaylistsPage from './PlaylistsPage';
import { renderWithProviders } from '../../test/renderWithProviders';

beforeEach(() => {
  window.localStorage.clear();
});

describe('PlaylistsPage', () => {
  it('bấm Tạo khi ô tên trống thì hiển thị lỗi và không tạo playlist', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PlaylistsPage />);

    await user.click(screen.getByRole('button', { name: 'Tạo' }));

    expect(
      screen.getByText('Tên playlist không được để trống'),
    ).toBeInTheDocument();
    expect(screen.getByText('Chưa có playlist nào.')).toBeInTheDocument();
  });

  it('nhập tên hợp lệ rồi bấm Tạo thì playlist xuất hiện trong danh sách', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PlaylistsPage />);

    await user.type(screen.getByLabelText('Tên playlist'), 'Chạy bộ');
    await user.click(screen.getByRole('button', { name: 'Tạo' }));

    expect(screen.getByText('Chạy bộ')).toBeInTheDocument();
    expect(screen.getByText('0 bài')).toBeInTheDocument();
    expect(screen.getByLabelText('Tên playlist')).toHaveValue('');
  });

  it('không cho tạo tên trùng (không phân biệt hoa thường)', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PlaylistsPage />);

    const nameInput = screen.getByLabelText('Tên playlist');
    const createButton = screen.getByRole('button', { name: 'Tạo' });

    await user.type(nameInput, 'Chạy bộ');
    await user.click(createButton);
    await user.type(nameInput, 'chạy bộ');
    await user.click(createButton);

    expect(screen.getByText('Tên playlist đã tồn tại')).toBeInTheDocument();
    expect(screen.getAllByText(/Chạy bộ/i)).toHaveLength(1);
  });

  it('nút Xóa gỡ playlist khỏi danh sách', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PlaylistsPage />);

    await user.type(screen.getByLabelText('Tên playlist'), 'Học bài');
    await user.click(screen.getByRole('button', { name: 'Tạo' }));
    expect(screen.getByText('Học bài')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Xóa/ }));
    expect(screen.queryByText('Học bài')).not.toBeInTheDocument();
    expect(screen.getByText('Chưa có playlist nào.')).toBeInTheDocument();
  });
});
