<?php
namespace Application\Controller;

use LeoGalleguillos\User\Model\Factory as UserFactory;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class Index extends AbstractActionController
{
    public function __construct(
        UserFactory\User $userFactory
    ) {
        $this->userFactory = $userFactory;
    }

    public function indexAction()
    {
        $viewModel = new ViewModel();
        $viewModel->setTerminal(true);
        return $viewModel;
    }
}
