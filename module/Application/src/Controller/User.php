<?php
namespace Application\Controller;

use LeoGalleguillos\User\Model\Factory as UserFactory;
use LeoGalleguillos\User\Model\Table as UserTable;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class User extends AbstractActionController
{
    public function __construct(
        UserFactory\User\BuildFromCookies $buildFromCookiesFactory,
        UserTable\User\DisplayName $displayNameTable
    ) {
        $this->buildFromCookiesFactory = $buildFromCookiesFactory;
        $this->displayNameTable        = $displayNameTable;
    }

    public function getDisplayNameAction()
    {
        $viewModel = new ViewModel();
        $viewModel->setTerminal(true);

        $viewModel->setVariable(
            'userEntity',
            $this->buildFromCookiesFactory->buildFromCookies()
        );

        return $viewModel;
    }

    public function updateDisplayNameAction()
    {
        $displayName = $_POST['display-name'];
        $userEntity  = $this->buildFromCookiesFactory->buildFromCookies();

        $this->displayNameTable->updateWhereUserId(
            $displayName,
            $userEntity->getUserId()
        );

        $viewModel = new ViewModel();
        $viewModel->setTerminal(true);
        return $viewModel;
    }
}
