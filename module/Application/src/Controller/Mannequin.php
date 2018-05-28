<?php
namespace Application\Controller;

use LeoGalleguillos\User\Model\Factory as UserFactory;
use LeoGalleguillos\User\Model\Table as UserTable;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class Mannequin extends AbstractActionController
{
    /**
    public function __construct(
        UserFactory\User\BuildFromCookies $buildFromCookiesFactory,
        UserTable\User\DisplayName $displayNameTable
    ) {
        $this->buildFromCookiesFactory = $buildFromCookiesFactory;
        $this->displayNameTable        = $displayNameTable;
    }
     */

    public function updateWhereUserIdAction()
    {
        $viewModel = new ViewModel();
        $viewModel->setTerminal(true);
        return $viewModel;
    }
}
