import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppProvider } from '@edx/frontend-platform/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import courseOutlineMessages from '@src/course-home/outline-tab/messages';
import { initializeMockApp, initializeTestStore } from '@src/setupTest';
import SidebarSequence from './SidebarSequence';

initializeMockApp();

describe('<SidebarSequence />', () => {
  let courseId;
  let store;
  let sequence;
  const sequenceDescription = 'sequence test description';

  const initTestStore = async (options) => {
    store = await initializeTestStore(options);
    const state = store.getState();
    courseId = state.courseware.courseId;
    let activeSequenceId = '';
    [activeSequenceId] = Object.keys(state.courseware.courseOutline.sequences);
    sequence = state.courseware.courseOutline.sequences[activeSequenceId];
  };

  function renderWithProvider(props = {}) {
    const { container } = render(
      <AppProvider store={store} wrapWithRouter={false}>
        <IntlProvider locale="en">
          <MemoryRouter>
            <SidebarSequence
              courseId={courseId}
              defaultOpen={false}
              sequence={sequence}
              activeUnitId={sequence.unitIds[0]}
              {...props}
            />
          </MemoryRouter>
        </IntlProvider>
      </AppProvider>,
    );
    return container;
  }

  it('renders correctly when sequence is collapsed and incomplete', async () => {
    await initTestStore();
    renderWithProvider();

    expect(screen.getByText(sequence.title)).toBeInTheDocument();
    expect(screen.queryByText(sequenceDescription)).not.toBeInTheDocument();
    expect(screen.getByText(`, ${courseOutlineMessages.incompleteAssignment.defaultMessage}`)).toBeInTheDocument();
  });

  it('renders correctly when sequence is not collapsed and complete', async () => {
    await initTestStore();
    renderWithProvider({
      defaultOpen: true,
      sequence: {
        ...sequence,
        specialExamInfo: sequenceDescription,
        complete: true,
      },
    });

    expect(screen.getByText(sequence.title)).toBeInTheDocument();
    expect(screen.getByText(sequenceDescription)).toBeInTheDocument();
    expect(screen.getByText(`, ${courseOutlineMessages.completedAssignment.defaultMessage}`)).toBeInTheDocument();
    userEvent.click(screen.getByText(sequence.title));
  });
});
